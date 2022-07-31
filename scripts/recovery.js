const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [recoverer] = await ethers.getSigners();

  const SimpleToken = await ethers.getContractFactory("SimpleToken");
  const simpleToken = await SimpleToken.attach("0xf94D4303907261a15a9802F0ee2039769974cD5F");

  let balance = await ethers.provider.getBalance(simpleToken.address);
  console.log("Token balance before:", ethers.utils.formatEther(balance.toString()));
  await (await simpleToken.destroy(recoverer.address)).wait();

  balance = await ethers.provider.getBalance(simpleToken.address);
  console.log("Token balance after:", ethers.utils.formatEther(balance.toString()));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
