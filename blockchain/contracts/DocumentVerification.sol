// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DocumentVerification
 * @dev Smart contract for document verification and IPFS hash storage
 * @author LandLedger Team
 */
contract DocumentVerification is AccessControl, ReentrancyGuard {
    
    bytes32 public constant OFFICIAL_ROLE = keccak256("OFFICIAL_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    // Document structure
    struct Document {
        string ipfsHash;           // IPFS hash for document storage
        string documentHash;       // SHA-256 hash of document content
        address uploadedBy;        // Address that uploaded the document
        uint256 timestamp;         // Upload timestamp
        bool isVerified;          // Official verification status
        string documentType;       // Type: deed, survey, identity, etc.
        address verifiedBy;        // Address that verified the document
        uint256 verificationDate; // Verification timestamp
        bool isActive;            // Document active status
    }
    
    // Document verification status
    enum VerificationStatus {
        Pending,     // Awaiting verification
        Verified,    // Officially verified
        Rejected,    // Verification rejected
        Expired      // Document expired
    }
    
    // State variables
    mapping(string => Document) public documents;                    // landId => Document
    mapping(string => bool) public documentExists;                  // documentHash => exists
    mapping(address => string[]) public userDocuments;              // user => documentHashes[]
    mapping(string => VerificationStatus) public verificationStatus; // documentHash => status
    
    string[] public allDocumentHashes;
    uint256 public totalDocuments;
    uint256 public verifiedDocuments;
    
    // Events
    event DocumentUploaded(
        string indexed landId,
        string documentHash,
        address indexed uploadedBy,
        uint256 timestamp,
        string ipfsHash
    );
    
    event DocumentVerified(
        string indexed landId,
        string documentHash,
        bool isValid,
        address indexed verifiedBy,
        uint256 timestamp
    );
    
    event DocumentRejected(
        string indexed landId,
        string documentHash,
        address indexed rejectedBy,
        string reason,
        uint256 timestamp
    );
    
    event DocumentUpdated(
        string indexed landId,
        string oldHash,
        string newHash,
        address indexed updatedBy,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyOfficial() {
        require(hasRole(OFFICIAL_ROLE, msg.sender) || hasRole(ADMIN_ROLE, msg.sender), 
                "DocumentVerification: Official access required");
        _;
    }
    
    modifier documentNotExists(string memory _documentHash) {
        require(!documentExists[_documentHash], 
                "DocumentVerification: Document already exists");
        _;
    }
    
    modifier documentExistsCheck(string memory _documentHash) {
        require(documentExists[_documentHash], 
                "DocumentVerification: Document does not exist");
        _;
    }
    
    modifier validString(string memory _str) {
        require(bytes(_str).length > 0, 
                "DocumentVerification: String cannot be empty");
        _;
    }
    
    modifier validAddress(address _addr) {
        require(_addr != address(0), 
                "DocumentVerification: Invalid address");
        _;
    }
    
    /**
     * @dev Constructor
     * @param _admin Admin address
     */
    constructor(address _admin) {
        require(_admin != address(0), "DocumentVerification: Invalid admin address");
        
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(OFFICIAL_ROLE, _admin);
        
        totalDocuments = 0;
        verifiedDocuments = 0;
    }
    
    /**
     * @dev Upload a document
     * @param _landId Associated land identifier
     * @param _ipfsHash IPFS hash of the document
     * @param _documentHash SHA-256 hash of document content
     * @param _documentType Type of document
     */
    function uploadDocument(
        string memory _landId,
        string memory _ipfsHash,
        string memory _documentHash,
        string memory _documentType
    ) 
        external 
        nonReentrant
        validString(_landId)
        validString(_ipfsHash)
        validString(_documentHash)
        validString(_documentType)
        documentNotExists(_documentHash)
    {
        // Create new document
        Document memory newDocument = Document({
            ipfsHash: _ipfsHash,
            documentHash: _documentHash,
            uploadedBy: msg.sender,
            timestamp: block.timestamp,
            isVerified: false,
            documentType: _documentType,
            verifiedBy: address(0),
            verificationDate: 0,
            isActive: true
        });
        
        // Store document
        documents[_landId] = newDocument;
        documentExists[_documentHash] = true;
        userDocuments[msg.sender].push(_documentHash);
        allDocumentHashes.push(_documentHash);
        verificationStatus[_documentHash] = VerificationStatus.Pending;
        totalDocuments++;
        
        emit DocumentUploaded(_landId, _documentHash, msg.sender, block.timestamp, _ipfsHash);
    }
    
    /**
     * @dev Verify a document
     * @param _landId Land identifier
     * @param _documentHash Document hash to verify
     * @param _isValid Whether the document is valid
     * @param _reason Reason for rejection (if invalid)
     */
    function verifyDocument(
        string memory _landId,
        string memory _documentHash,
        bool _isValid,
        string memory _reason
    ) 
        external 
        onlyOfficial 
        nonReentrant
        validString(_landId)
        validString(_documentHash)
        documentExistsCheck(_documentHash)
    {
        Document storage doc = documents[_landId];
        require(keccak256(bytes(doc.documentHash)) == keccak256(bytes(_documentHash)), 
                "DocumentVerification: Document hash mismatch");
        require(!doc.isVerified, 
                "DocumentVerification: Document already verified");
        
        if (_isValid) {
            // Verify document
            doc.isVerified = true;
            doc.verifiedBy = msg.sender;
            doc.verificationDate = block.timestamp;
            verificationStatus[_documentHash] = VerificationStatus.Verified;
            verifiedDocuments++;
            
            emit DocumentVerified(_landId, _documentHash, true, msg.sender, block.timestamp);
        } else {
            // Reject document
            require(bytes(_reason).length > 0, 
                    "DocumentVerification: Rejection reason required");
            verificationStatus[_documentHash] = VerificationStatus.Rejected;
            
            emit DocumentRejected(_landId, _documentHash, msg.sender, _reason, block.timestamp);
        }
    }
    
    /**
     * @dev Update document IPFS hash
     * @param _landId Land identifier
     * @param _oldHash Old document hash
     * @param _newIpfsHash New IPFS hash
     * @param _newDocumentHash New document hash
     */
    function updateDocument(
        string memory _landId,
        string memory _oldHash,
        string memory _newIpfsHash,
        string memory _newDocumentHash
    ) 
        external 
        nonReentrant
        validString(_landId)
        validString(_oldHash)
        validString(_newIpfsHash)
        validString(_newDocumentHash)
        documentExistsCheck(_oldHash)
        documentNotExists(_newDocumentHash)
    {
        Document storage doc = documents[_landId];
        require(keccak256(bytes(doc.documentHash)) == keccak256(bytes(_oldHash)), 
                "DocumentVerification: Document hash mismatch");
        require(doc.uploadedBy == msg.sender || hasRole(OFFICIAL_ROLE, msg.sender), 
                "DocumentVerification: Not authorized to update");
        require(!doc.isVerified, 
                "DocumentVerification: Cannot update verified document");
        
        // Update document
        doc.ipfsHash = _newIpfsHash;
        doc.documentHash = _newDocumentHash;
        doc.timestamp = block.timestamp;
        
        // Update mappings
        documentExists[_oldHash] = false;
        documentExists[_newDocumentHash] = true;
        verificationStatus[_newDocumentHash] = VerificationStatus.Pending;
        delete verificationStatus[_oldHash];
        
        // Update user documents array
        _updateUserDocuments(msg.sender, _oldHash, _newDocumentHash);
        
        emit DocumentUpdated(_landId, _oldHash, _newDocumentHash, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Get document details
     * @param _landId Land identifier
     * @return Document details
     */
    function getDocument(string memory _landId) 
        external 
        view 
        validString(_landId)
        returns (Document memory) 
    {
        return documents[_landId];
    }
    
    /**
     * @dev Verify document authenticity by hash comparison
     * @param _landId Land identifier
     * @param _documentHash Document hash to verify
     * @return isValid Whether the document is authentic
     * @return isVerified Whether the document is officially verified
     */
    function verifyDocumentAuthenticity(
        string memory _landId,
        string memory _documentHash
    ) 
        external 
        view 
        validString(_landId)
        validString(_documentHash)
        returns (bool isValid, bool isVerified) 
    {
        Document memory doc = documents[_landId];
        isValid = keccak256(bytes(doc.documentHash)) == keccak256(bytes(_documentHash));
        isVerified = doc.isVerified;
        
        return (isValid, isVerified);
    }
    
    /**
     * @dev Get documents uploaded by a user
     * @param _user User address
     * @return Array of document hashes
     */
    function getUserDocuments(address _user) 
        external 
        view 
        validAddress(_user)
        returns (string[] memory) 
    {
        return userDocuments[_user];
    }
    
    /**
     * @dev Get verification status of a document
     * @param _documentHash Document hash
     * @return VerificationStatus enum value
     */
    function getVerificationStatus(string memory _documentHash) 
        external 
        view 
        validString(_documentHash)
        returns (VerificationStatus) 
    {
        return verificationStatus[_documentHash];
    }
    
    /**
     * @dev Get all document hashes
     * @return Array of all document hashes
     */
    function getAllDocumentHashes() external view returns (string[] memory) {
        return allDocumentHashes;
    }
    
    /**
     * @dev Check if document exists
     * @param _documentHash Document hash
     * @return Boolean existence status
     */
    function documentExistsPublic(string memory _documentHash) 
        external 
        view 
        returns (bool) 
    {
        return documentExists[_documentHash];
    }
    
    /**
     * @dev Deactivate a document
     * @param _landId Land identifier
     * @param _documentHash Document hash
     */
    function deactivateDocument(
        string memory _landId,
        string memory _documentHash
    ) 
        external 
        onlyOfficial 
        nonReentrant
        validString(_landId)
        validString(_documentHash)
        documentExistsCheck(_documentHash)
    {
        Document storage doc = documents[_landId];
        require(keccak256(bytes(doc.documentHash)) == keccak256(bytes(_documentHash)), 
                "DocumentVerification: Document hash mismatch");
        require(doc.isActive, 
                "DocumentVerification: Document already inactive");
        
        doc.isActive = false;
        verificationStatus[_documentHash] = VerificationStatus.Expired;
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
     * @dev Internal function to update user documents array
     * @param _user User address
     * @param _oldHash Old document hash
     * @param _newHash New document hash
     */
    function _updateUserDocuments(
        address _user,
        string memory _oldHash,
        string memory _newHash
    ) internal {
        string[] storage userDocs = userDocuments[_user];
        for (uint256 i = 0; i < userDocs.length; i++) {
            if (keccak256(bytes(userDocs[i])) == keccak256(bytes(_oldHash))) {
                userDocs[i] = _newHash;
                break;
            }
        }
    }
    
    /**
     * @dev Get contract statistics
     * @return totalDocuments Total number of documents
     * @return verifiedDocuments Number of verified documents
     * @return pendingDocuments Number of pending documents
     */
    function getDocumentStats() external view returns (uint256, uint256, uint256) {
        uint256 pendingDocuments = 0;
        
        for (uint256 i = 0; i < allDocumentHashes.length; i++) {
            if (verificationStatus[allDocumentHashes[i]] == VerificationStatus.Pending) {
                pendingDocuments++;
            }
        }
        
        return (totalDocuments, verifiedDocuments, pendingDocuments);
    }
}
