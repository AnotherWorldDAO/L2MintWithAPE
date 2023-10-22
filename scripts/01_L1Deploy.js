
  // run this under the repo root
  // npx hardhat run scripts\01_L1Deploy.js --network goerli
  //
  // goerli
  // MockAPE 0x72CfCf91bB8b19050dFAD21fe76631398d58028A
  // MintWithApeL1 0x6779B507Ee71B5aE50f663B1F2E55993449E2eB7

const { ethers, network } = require("hardhat");

async function main() {
  const [deployer, player1] = await ethers.getSigners();

  console.log("deployer:", deployer.address);
  // check account balance
  console.log(
    "deployer balance:",
    ethers.utils.formatEther(await deployer.getBalance())
  );
  console.log("");
  console.log("player1:", player1.address);
  console.log(
    "player1 balance:",
    ethers.utils.formatEther(await player1.getBalance())
  );

  const MintWithApeL1Contract = await ethers.getContractFactory(
    "MintWithApeL1"
  );

  const MockAPEContract = await ethers.getContractFactory(
    "MockAPE"
  );

  // deploy MockAPE as erc20
  const MockAPE =
  await MockAPEContract.deploy();
  await MockAPE.deployed();
  console.log(`MockAPE Contract deployed to ${MockAPE.address} on ${network.name}`);

  await MockAPE.connect(deployer).transfer(player1.address, ethers.utils.parseEther("10000.0"));

  const MintWithApeL1 = await MintWithApeL1Contract.deploy();
  await MintWithApeL1.deployed();
  console.log(`MintWithApeL1 Contract deployed to ${MintWithApeL1.address} on ${network.name}`);
  const WAIT_BLOCK_CONFIRMATIONS = 6;
  await MintWithApeL1.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
  await MintWithApeL1.connect(deployer).setErc20TokenAddress(MockAPE.address);

  console.log("deployer:", deployer.address);
  // check account balance
  console.log(
    "deployer balance:",
    ethers.utils.formatEther(await deployer.getBalance())
  );
  console.log("");
  console.log("player1:", player1.address);
  console.log(
    "player1 balance:",
    ethers.utils.formatEther(await player1.getBalance())
  );

  console.log("\ndone!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
