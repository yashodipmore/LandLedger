import { ethers, run } from "hardhat";

async function main() {
  console.log("🚀 Starting LandLedger contract deployment...\n");
  
  // Get signers
  const [deployer, official, user1, user2] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());
  console.log("Network:", await deployer.provider.getNetwork());
  console.log();
  
  // Deploy DocumentVerification contract
  console.log("📄 Deploying DocumentVerification contract...");
  const DocumentVerificationFactory = await ethers.getContractFactory("DocumentVerification");
  const documentVerification = await DocumentVerificationFactory.deploy(deployer.address);
  await documentVerification.waitForDeployment();
  const documentVerificationAddress = await documentVerification.getAddress();
  
  console.log("✅ DocumentVerification deployed to:", documentVerificationAddress);
  console.log();
  
  // Deploy LandRegistry contract
  console.log("🏡 Deploying LandRegistry contract...");
  const LandRegistryFactory = await ethers.getContractFactory("LandRegistry");
  const landRegistry = await LandRegistryFactory.deploy(deployer.address);
  await landRegistry.waitForDeployment();
  const landRegistryAddress = await landRegistry.getAddress();
  
  console.log("✅ LandRegistry deployed to:", landRegistryAddress);
  console.log();
  
  // Setup roles
  console.log("👮 Setting up roles...");
  await landRegistry.grantOfficialRole(official.address);
  await documentVerification.grantOfficialRole(official.address);
  
  console.log("✅ Official role granted to:", official.address);
  console.log();
  
  // Verify contracts if on testnet
  const network = await ethers.provider.getNetwork();
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("🔍 Verifying contracts on Etherscan...");
    
    try {
      await run("verify:verify", {
        address: landRegistryAddress,
        constructorArguments: [deployer.address],
      });
      console.log("✅ LandRegistry verified on Etherscan");
      
      await run("verify:verify", {
        address: documentVerificationAddress,
        constructorArguments: [deployer.address],
      });
      console.log("✅ DocumentVerification verified on Etherscan");
    } catch (error) {
      console.log("❌ Verification failed:", error);
    }
  }
  
  // Display deployment summary
  console.log("\n🎉 Deployment Summary:");
  console.log("==================================================");
  console.log(`🏡 LandRegistry:          ${landRegistryAddress}`);
  console.log(`📄 DocumentVerification:  ${documentVerificationAddress}`);
  console.log(`👮 Official:              ${official.address}`);
  console.log(`👤 User1:                 ${user1.address}`);
  console.log(`👤 User2:                 ${user2.address}`);
  console.log("==================================================");
  
  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(),
    deployer: deployer.address,
    official: official.address,
    contracts: {
      LandRegistry: landRegistryAddress,
      DocumentVerification: documentVerificationAddress,
    },
    timestamp: new Date().toISOString(),
  };
  
  console.log("\n📝 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  return deploymentInfo;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then((deploymentInfo) => {
    console.log("\n✅ Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
