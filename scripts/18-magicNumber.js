const hre = require("hardhat");
const { web3, ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const bytecode = "0x600a600c600039600a6000f3602a60805260206080f3";
  // CONTRACT CREATION PART:
  // [1] PUSH1 0x0a
  // [3] PUSH1 0x0c
  // [5] PUSH1 0x00
  // [6] CODECOPY
  // [8] PUSH1 0x0a
  // [10] PUSH1 0x00
  // [11] RETURN
  // WRITING VALUE IN MEMORY AND RETURNING FROM THERE
  // [13] PUSH1 0x2a
  // [15] PUSH1 0x80
  // [16] MSTORE
  // [18] PUSH1 0x20
  // [20] PUSH1 0x80
  // [21] RETURN
  const returnVal = await web3.eth.sendTransaction({ from: deployer.address, data: bytecode }, function (err, res) {
    console.log("TX hash:", res);
  });

  const { contractAddress } = returnVal;

  console.log("Deployed address:", contractAddress);

  await web3.eth
    .sendTransaction({ from: deployer.address, to: contractAddress, data: web3.eth.abi.encodeFunctionSignature("whatIsTheMeaningOfLife()") })
    .on("receipt", (receipt) => {
      console.log("receipt:", receipt);
    })
    .on("error", (error) => {
      console.log("error:", error);
    });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
