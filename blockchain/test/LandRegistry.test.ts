import { expect } from "chai";
import { ethers } from "hardhat";
import { LandRegistry, DocumentVerification } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

describe("LandRegistry Contract", function () {
  let landRegistry: LandRegistry;
  let documentVerification: DocumentVerification;
  let admin: SignerWithAddress;
  let official: SignerWithAddress;
  let owner1: SignerWithAddress;
  let owner2: SignerWithAddress;
  let citizen: SignerWithAddress;

  beforeEach(async function () {
    // Get signers
    [admin, official, owner1, owner2, citizen] = await ethers.getSigners();
    
    // Deploy DocumentVerification
    const DocumentVerificationFactory = await ethers.getContractFactory("DocumentVerification");
    documentVerification = await DocumentVerificationFactory.deploy(admin.address);
    await documentVerification.waitForDeployment();
    
    // Deploy LandRegistry
    const LandRegistryFactory = await ethers.getContractFactory("LandRegistry");
    landRegistry = await LandRegistryFactory.deploy(admin.address);
    await landRegistry.waitForDeployment();
    
    // Setup roles
    await landRegistry.grantOfficialRole(official.address);
    await documentVerification.grantOfficialRole(official.address);
  });

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      const ADMIN_ROLE = await landRegistry.ADMIN_ROLE();
      expect(await landRegistry.hasRole(ADMIN_ROLE, admin.address)).to.be.true;
    });

    it("Should grant official role correctly", async function () {
      const OFFICIAL_ROLE = await landRegistry.OFFICIAL_ROLE();
      expect(await landRegistry.hasRole(OFFICIAL_ROLE, official.address)).to.be.true;
    });

    it("Should start with zero lands", async function () {
      expect(await landRegistry.totalLands()).to.equal(0);
    });
  });

  describe("Land Registration", function () {
    const landId = "LD001";
    const latitude = 40712800; // NYC latitude * 1e6
    const longitude = -74006000; // NYC longitude * 1e6
    const area = 1000;
    const documentHash = "QmX1Y2Z3...";
    const physicalAddress = "123 Main St, New York, NY";
    const landType = "residential";

    it("Should register a new land by official", async function () {
      await expect(
        landRegistry.connect(official).registerLand(
          landId,
          owner1.address,
          latitude,
          longitude,
          area,
          documentHash,
          physicalAddress,
          landType
        )
      ).to.emit(landRegistry, "LandRegistered")
       .withArgs(landId, owner1.address, anyValue, documentHash);
      
      expect(await landRegistry.totalLands()).to.equal(1);
      
      const land = await landRegistry.getLandDetails(landId);
      expect(land.landId).to.equal(landId);
      expect(land.owner).to.equal(owner1.address);
      expect(land.area).to.equal(area);
      expect(land.isActive).to.be.true;
    });

    it("Should fail when non-official tries to register", async function () {
      await expect(
        landRegistry.connect(citizen).registerLand(
          landId,
          owner1.address,
          latitude,
          longitude,
          area,
          documentHash,
          physicalAddress,
          landType
        )
      ).to.be.revertedWith("LandRegistry: Official access required");
    });

    it("Should fail with empty land ID", async function () {
      await expect(
        landRegistry.connect(official).registerLand(
          "",
          owner1.address,
          latitude,
          longitude,
          area,
          documentHash,
          physicalAddress,
          landType
        )
      ).to.be.revertedWith("LandRegistry: Land ID cannot be empty");
    });

    it("Should fail with zero area", async function () {
      await expect(
        landRegistry.connect(official).registerLand(
          landId,
          owner1.address,
          latitude,
          longitude,
          0,
          documentHash,
          physicalAddress,
          landType
        )
      ).to.be.revertedWith("LandRegistry: Area must be greater than 0");
    });

    it("Should fail with duplicate land ID", async function () {
      // Register first land
      await landRegistry.connect(official).registerLand(
        landId,
        owner1.address,
        latitude,
        longitude,
        area,
        documentHash,
        physicalAddress,
        landType
      );
      
      // Try to register same land ID again
      await expect(
        landRegistry.connect(official).registerLand(
          landId,
          owner2.address,
          latitude,
          longitude,
          area,
          "QmA1B2C3...",
          physicalAddress,
          landType
        )
      ).to.be.revertedWith("LandRegistry: Land already exists");
    });
  });

  describe("Land Transfer", function () {
    const latitude = 40712800;
    const longitude = -74006000;
    const area = 1000;
    const documentHash = "QmX1Y2Z3...";
    const physicalAddress = "123 Main St, New York, NY";
    const landType = "residential";
    const transferAmount = ethers.parseEther("10");

    it("Should request transfer by land owner", async function () {
      const landId = "LD101";
      // Register a land first
      await landRegistry.connect(official).registerLand(
        landId,
        owner1.address,
        latitude,
        longitude,
        area,
        documentHash,
        physicalAddress,
        landType
      );

      await expect(
        landRegistry.connect(owner1).requestTransfer(
          landId,
          owner2.address,
          transferAmount
        )
      ).to.emit(landRegistry, "TransferRequested")
       .withArgs(landId, owner1.address, owner2.address, anyValue);
      
      const pendingTransfer = await landRegistry.getPendingTransfer(landId);
      expect(pendingTransfer.fromOwner).to.equal(owner1.address);
      expect(pendingTransfer.toOwner).to.equal(owner2.address);
      expect(pendingTransfer.amount).to.equal(transferAmount);
    });

    it("Should fail when non-owner requests transfer", async function () {
      const landId = "LD102";
      // Register a land first
      await landRegistry.connect(official).registerLand(
        landId,
        owner1.address,
        latitude,
        longitude,
        area,
        documentHash,
        physicalAddress,
        landType
      );

      await expect(
        landRegistry.connect(owner2).requestTransfer(
          landId,
          citizen.address,
          transferAmount
        )
      ).to.be.revertedWith("LandRegistry: Only land owner can perform this action");
    });

    it("Should approve transfer by official", async function () {
      const landId = "LD103";
      // Register a land first
      await landRegistry.connect(official).registerLand(
        landId,
        owner1.address,
        latitude,
        longitude,
        area,
        documentHash,
        physicalAddress,
        landType
      );

      // Request transfer
      await landRegistry.connect(owner1).requestTransfer(
        landId,
        owner2.address,
        transferAmount
      );
      
      // Approve transfer
      await expect(
        landRegistry.connect(official).approveTransfer(landId)
      ).to.emit(landRegistry, "TransferApproved")
       .withArgs(landId, owner2.address, official.address, anyValue);
      
      // Check ownership change
      const land = await landRegistry.getLandDetails(landId);
      expect(land.owner).to.equal(owner2.address);
      expect(land.transferCount).to.equal(1);
      
      // Check owner lands mapping
      const owner1Lands = await landRegistry.getOwnerLands(owner1.address);
      const owner2Lands = await landRegistry.getOwnerLands(owner2.address);
      expect(owner1Lands.length).to.equal(0);
      expect(owner2Lands.length).to.equal(1);
      expect(owner2Lands[0]).to.equal(landId);
    });

    it("Should reject transfer by official", async function () {
      const landId = "LD104";
      const rejectionReason = "Invalid documentation";
      
      // Register a land first
      await landRegistry.connect(official).registerLand(
        landId,
        owner1.address,
        latitude,
        longitude,
        area,
        documentHash,
        physicalAddress,
        landType
      );
      
      // Request transfer
      await landRegistry.connect(owner1).requestTransfer(
        landId,
        owner2.address,
        transferAmount
      );
      
      // Reject transfer
      await expect(
        landRegistry.connect(official).rejectTransfer(landId, rejectionReason)
      ).to.emit(landRegistry, "TransferRejected")
       .withArgs(landId, official.address, rejectionReason, anyValue);
      
      // Check ownership remains same
      const land = await landRegistry.getLandDetails(landId);
      expect(land.owner).to.equal(owner1.address);
      expect(land.transferCount).to.equal(0);
    });
  });

  describe("Contract Statistics", function () {
    it("Should return correct stats", async function () {
      // Register multiple lands
      await landRegistry.connect(official).registerLand(
        "LD001",
        owner1.address,
        40712800,
        -74006000,
        1000,
        "QmX1Y2Z3...",
        "123 Main St",
        "residential"
      );
      
      await landRegistry.connect(official).registerLand(
        "LD002",
        owner2.address,
        40712900,
        -74006100,
        1500,
        "QmA1B2C3...",
        "456 Oak Ave",
        "commercial"
      );
      
      const [totalLands, totalTransfers, totalOwners] = await landRegistry.getContractStats();
      expect(totalLands).to.equal(2);
      expect(totalTransfers).to.equal(0);
      expect(totalOwners).to.equal(2);
    });
  });

  describe("User Verification", function () {
    it("Should verify user by official", async function () {
      await expect(
        landRegistry.connect(official).verifyUser(owner1.address)
      ).to.emit(landRegistry, "UserVerified")
       .withArgs(owner1.address, official.address, anyValue);
      
      expect(await landRegistry.isUserVerified(owner1.address)).to.be.true;
    });

    it("Should fail when non-official tries to verify", async function () {
      await expect(
        landRegistry.connect(citizen).verifyUser(owner1.address)
      ).to.be.revertedWith("LandRegistry: Official access required");
    });
  });
});
