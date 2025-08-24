// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title LandRegistry
 * @dev Smart contract for decentralized land registry system
 * @author LandLedger Team
 */
contract LandRegistry is AccessControl, ReentrancyGuard, Pausable {
    
    // Role definitions
    bytes32 public constant OFFICIAL_ROLE = keccak256("OFFICIAL_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    // Land structure
    struct Land {
        string landId;              // Unique identifier (e.g., "LD001")
        address owner;              // Current owner address
        int256 latitude;            // Coordinates (scaled by 1e6)
        int256 longitude;           // Coordinates (scaled by 1e6)
        uint256 area;               // Area in square meters
        string documentHash;        // IPFS document hash
        uint256 registrationDate;  // Timestamp of registration
        bool isActive;              // Status flag
        uint256 transferCount;      // Number of transfers
        string physicalAddress;     // Physical address
        string landType;            // Type: residential, commercial, agricultural
    }
    
    // Transfer structure
    struct Transfer {
        string landId;
        address fromOwner;
        address toOwner;
        uint256 requestDate;
        uint256 approvalDate;
        address approvedBy;
        TransferStatus status;
        string reason;              // For rejections
        uint256 amount;             // Transfer amount (if any)
    }
    
    // Transfer status enum
    enum TransferStatus { 
        Pending, 
        Approved, 
        Rejected, 
        Completed 
    }
    
    // State variables
    mapping(string => Land) public lands;                    // landId => Land
    mapping(address => string[]) public ownerLands;          // owner => landIds[]
    mapping(string => Transfer[]) public transferHistory;    // landId => Transfer[]
    mapping(string => Transfer) public pendingTransfers;     // landId => Transfer
    mapping(address => bool) public verifiedUsers;           // user => verified
    
    string[] public allLandIds;
    uint256 public totalLands;
    uint256 public totalTransfers;
    
    // Events
    event LandRegistered(
        string indexed landId,
        address indexed owner,
        uint256 timestamp,
        string documentHash
    );
    
    event TransferRequested(
        string indexed landId,
        address indexed fromOwner,
        address indexed toOwner,
        uint256 timestamp
    );
    
    event TransferApproved(
        string indexed landId,
        address indexed newOwner,
        address indexed approvedBy,
        uint256 timestamp
    );
    
    event TransferRejected(
        string indexed landId,
        address indexed rejectedBy,
        string reason,
        uint256 timestamp
    );
    
    event OwnershipTransferred(
        string indexed landId,
        address indexed previousOwner,
        address indexed newOwner,
        uint256 timestamp
    );
    
    event UserVerified(
        address indexed user,
        address indexed verifiedBy,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyOfficial() {
        require(hasRole(OFFICIAL_ROLE, msg.sender) || hasRole(ADMIN_ROLE, msg.sender), 
                "LandRegistry: Official access required");
        _;
    }
    
    modifier onlyLandOwner(string memory _landId) {
        require(lands[_landId].owner == msg.sender, 
                "LandRegistry: Only land owner can perform this action");
        _;
    }
    
    modifier landExists(string memory _landId) {
        require(bytes(lands[_landId].landId).length > 0, 
                "LandRegistry: Land does not exist");
        _;
    }
    
    modifier landNotExists(string memory _landId) {
        require(bytes(lands[_landId].landId).length == 0, 
                "LandRegistry: Land already exists");
        _;
    }
    
    modifier validAddress(address _addr) {
        require(_addr != address(0), 
                "LandRegistry: Invalid address");
        _;
    }
    
    /**
     * @dev Constructor
     * @param _admin Admin address
     */
    constructor(address _admin) {
        require(_admin != address(0), "LandRegistry: Invalid admin address");
        
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(OFFICIAL_ROLE, _admin);
        
        totalLands = 0;
        totalTransfers = 0;
    }
    
    /**
     * @dev Register a new land
     * @param _landId Unique land identifier
     * @param _owner Owner address
     * @param _latitude Latitude (scaled by 1e6)
     * @param _longitude Longitude (scaled by 1e6)
     * @param _area Area in square meters
     * @param _documentHash IPFS document hash
     * @param _physicalAddress Physical address
     * @param _landType Type of land
     */
    function registerLand(
        string memory _landId,
        address _owner,
        int256 _latitude,
        int256 _longitude,
        uint256 _area,
        string memory _documentHash,
        string memory _physicalAddress,
        string memory _landType
    ) 
        external 
        onlyOfficial 
        nonReentrant 
        whenNotPaused
        landNotExists(_landId)
        validAddress(_owner)
    {
        require(bytes(_landId).length > 0, "LandRegistry: Land ID cannot be empty");
        require(_area > 0, "LandRegistry: Area must be greater than 0");
        require(bytes(_documentHash).length > 0, "LandRegistry: Document hash required");
        
        // Create new land
        Land memory newLand = Land({
            landId: _landId,
            owner: _owner,
            latitude: _latitude,
            longitude: _longitude,
            area: _area,
            documentHash: _documentHash,
            registrationDate: block.timestamp,
            isActive: true,
            transferCount: 0,
            physicalAddress: _physicalAddress,
            landType: _landType
        });
        
        // Store land
        lands[_landId] = newLand;
        ownerLands[_owner].push(_landId);
        allLandIds.push(_landId);
        totalLands++;
        
        emit LandRegistered(_landId, _owner, block.timestamp, _documentHash);
    }
    
    /**
     * @dev Request land transfer
     * @param _landId Land identifier
     * @param _newOwner New owner address
     * @param _amount Transfer amount (optional)
     */
    function requestTransfer(
        string memory _landId,
        address _newOwner,
        uint256 _amount
    ) 
        external 
        nonReentrant 
        whenNotPaused
        landExists(_landId)
        onlyLandOwner(_landId)
        validAddress(_newOwner)
    {
        require(_newOwner != msg.sender, "LandRegistry: Cannot transfer to self");
        require(pendingTransfers[_landId].fromOwner == address(0), 
                "LandRegistry: Transfer already pending");
        
        // Create transfer request
        Transfer memory newTransfer = Transfer({
            landId: _landId,
            fromOwner: msg.sender,
            toOwner: _newOwner,
            requestDate: block.timestamp,
            approvalDate: 0,
            approvedBy: address(0),
            status: TransferStatus.Pending,
            reason: "",
            amount: _amount
        });
        
        pendingTransfers[_landId] = newTransfer;
        totalTransfers++;
        
        emit TransferRequested(_landId, msg.sender, _newOwner, block.timestamp);
    }
    
    /**
     * @dev Approve land transfer
     * @param _landId Land identifier
     */
    function approveTransfer(string memory _landId) 
        external 
        onlyOfficial 
        nonReentrant 
        whenNotPaused
        landExists(_landId)
    {
        Transfer storage transfer = pendingTransfers[_landId];
        require(transfer.fromOwner != address(0), 
                "LandRegistry: No pending transfer");
        
        address previousOwner = transfer.fromOwner;
        address newOwner = transfer.toOwner;
        
        // Update transfer status
        transfer.status = TransferStatus.Approved;
        transfer.approvalDate = block.timestamp;
        transfer.approvedBy = msg.sender;
        
        // Update land ownership
        lands[_landId].owner = newOwner;
        lands[_landId].transferCount++;
        
        // Update owner mappings
        _removeFromOwnerLands(previousOwner, _landId);
        ownerLands[newOwner].push(_landId);
        
        // Add to transfer history
        transferHistory[_landId].push(transfer);
        
        // Clear pending transfer
        delete pendingTransfers[_landId];
        
        emit TransferApproved(_landId, newOwner, msg.sender, block.timestamp);
        emit OwnershipTransferred(_landId, previousOwner, newOwner, block.timestamp);
    }
    
    /**
     * @dev Reject land transfer
     * @param _landId Land identifier
     * @param _reason Rejection reason
     */
    function rejectTransfer(string memory _landId, string memory _reason) 
        external 
        onlyOfficial 
        nonReentrant 
        whenNotPaused
        landExists(_landId)
    {
        Transfer storage transfer = pendingTransfers[_landId];
        require(transfer.fromOwner != address(0), 
                "LandRegistry: No pending transfer");
        require(bytes(_reason).length > 0, 
                "LandRegistry: Rejection reason required");
        
        // Update transfer status
        transfer.status = TransferStatus.Rejected;
        transfer.approvalDate = block.timestamp;
        transfer.approvedBy = msg.sender;
        transfer.reason = _reason;
        
        // Add to transfer history
        transferHistory[_landId].push(transfer);
        
        // Clear pending transfer
        delete pendingTransfers[_landId];
        
        emit TransferRejected(_landId, msg.sender, _reason, block.timestamp);
    }
    
    /**
     * @dev Get land details
     * @param _landId Land identifier
     * @return Land details
     */
    function getLandDetails(string memory _landId) 
        external 
        view 
        landExists(_landId)
        returns (Land memory) 
    {
        return lands[_landId];
    }
    
    /**
     * @dev Get lands owned by an address
     * @param _owner Owner address
     * @return Array of land IDs
     */
    function getOwnerLands(address _owner) 
        external 
        view 
        validAddress(_owner)
        returns (string[] memory) 
    {
        return ownerLands[_owner];
    }
    
    /**
     * @dev Get transfer history for a land
     * @param _landId Land identifier
     * @return Array of transfers
     */
    function getTransferHistory(string memory _landId) 
        external 
        view 
        landExists(_landId)
        returns (Transfer[] memory) 
    {
        return transferHistory[_landId];
    }
    
    /**
     * @dev Get pending transfer for a land
     * @param _landId Land identifier
     * @return Transfer details
     */
    function getPendingTransfer(string memory _landId) 
        external 
        view 
        landExists(_landId)
        returns (Transfer memory) 
    {
        return pendingTransfers[_landId];
    }
    
    /**
     * @dev Get all land IDs
     * @return Array of all land IDs
     */
    function getAllLandIds() external view returns (string[] memory) {
        return allLandIds;
    }
    
    /**
     * @dev Verify a user
     * @param _user User address to verify
     */
    function verifyUser(address _user) 
        external 
        onlyOfficial 
        validAddress(_user)
    {
        verifiedUsers[_user] = true;
        emit UserVerified(_user, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Check if user is verified
     * @param _user User address
     * @return Boolean verification status
     */
    function isUserVerified(address _user) external view returns (bool) {
        return verifiedUsers[_user];
    }
    
    /**
     * @dev Grant official role
     * @param _official Address to grant role
     */
    function grantOfficialRole(address _official) 
        external 
        onlyRole(ADMIN_ROLE) 
        validAddress(_official)
    {
        grantRole(OFFICIAL_ROLE, _official);
    }
    
    /**
     * @dev Revoke official role
     * @param _official Address to revoke role
     */
    function revokeOfficialRole(address _official) 
        external 
        onlyRole(ADMIN_ROLE) 
        validAddress(_official)
    {
        revokeRole(OFFICIAL_ROLE, _official);
    }
    
    /**
     * @dev Pause contract
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Internal function to remove land from owner's list
     * @param _owner Owner address
     * @param _landId Land identifier
     */
    function _removeFromOwnerLands(address _owner, string memory _landId) internal {
        string[] storage ownerLandsList = ownerLands[_owner];
        for (uint256 i = 0; i < ownerLandsList.length; i++) {
            if (keccak256(bytes(ownerLandsList[i])) == keccak256(bytes(_landId))) {
                ownerLandsList[i] = ownerLandsList[ownerLandsList.length - 1];
                ownerLandsList.pop();
                break;
            }
        }
    }
    
    /**
     * @dev Get contract stats
     * @return totalLands Total number of lands
     * @return totalTransfers Total number of transfers
     * @return totalOwners Total number of unique owners
     */
    function getContractStats() external view returns (uint256, uint256, uint256) {
        // Count unique owners
        uint256 uniqueOwners = 0;
        for (uint256 i = 0; i < allLandIds.length; i++) {
            if (ownerLands[lands[allLandIds[i]].owner].length > 0) {
                uniqueOwners++;
            }
        }
        
        return (totalLands, totalTransfers, uniqueOwners);
    }
}
