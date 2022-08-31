const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const denialInstAddr = "0x0788FdE740C919BdB867961D0afcF13BA1c8a883";
  const denial = await Denial.attach(denialInstAddr);

  const DenialPartner = await ethers.getContractFactory("DenialPartner");
  const denialPartner = await DenialPartner.deploy();

  await denial.setWithdrawPartner(denialPartner.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
