const hre = require("hardhat");

async function main() {
  // const gateKeeperAddr = "0x0ccdBBc96c21Ad83636fAc53D8E0b3745759036e";
  const GateKeeper = await hre.ethers.getContractFactory("GatekeeperOne");
  const gateKeeperInstance = await GateKeeper.deploy();
  await gateKeeperInstance.deployed();

  const GateKeeperHack = await hre.ethers.getContractFactory("GateKeeperHack");
  const gateKeeperHack = await GateKeeperHack.deploy(gateKeeperInstance.address);
  await gateKeeperHack.deployed();

  await gateKeeperHack.tryEnter("0x0000000000000000", { gasLimit: 80000 });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
