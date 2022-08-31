const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const DET_ADDRESS = "0x05A4eB9E3Ca0f351EF74A4Ca2712d379E838C664";
  const detToken = await ethers.getContractAt("DoubleEntryPoint", DET_ADDRESS);

  const fortaAddress = await detToken.forta();
  const forta = await ethers.getContractAt("Forta", fortaAddress);

  const DetectionBot = await ethers.getContractFactory("DetectionBot");
  const detectionBot = await DetectionBot.deploy(forta.address);
  await detectionBot.deployed();

  await forta.setDetectionBot(detectionBot.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
