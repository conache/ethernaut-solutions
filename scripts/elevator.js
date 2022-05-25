// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const provider = hre.waffle.provider;

async function main() {
  const elevatorInstAddr = "0x65344daEeB6398D1B20d42952C67e85Cdb75F5f4";
  const Elevator = await hre.ethers.getContractFactory("Elevator");
  const elevator = await Elevator.attach(elevatorInstAddr);

  console.log("Elevator address:", elevator.address);

  const House = await hre.ethers.getContractFactory("House");
  const house = await House.deploy(elevator.address);

  console.log("House address:", house.address);
  // await house.trickElevator();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
