const hre = require("hardhat");
const { web3, ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  // const MagicNum = await ethers.getContractFactory("MagicNum");

  // const magicNum = await MagicNum.attach("0x4E87ae14F2C79F4e20B361125a16Fbe3774BC15B");

  const bytecode =
    "0x6080604052348015600f57600080fd5b5060848061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063650500c114602d575b600080fd5b60336049565b6040805160ff9092168252519081900360200190f35b602a9056fea2646970667358221220e2137077d72c1c687ffe04184b7922d9d609409dde38c47e456e332304b406cc64736f6c634300060c0033";
  const returnVal = await web3.eth.sendTransaction({ from: deployer.address, data: bytecode }, function (err, res) {
    console.log("TX hash:", res);
  });

  const { contractAddress } = returnVal;
  console.log("Contract address:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
