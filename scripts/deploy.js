// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const AirdropFactory = await hre.ethers.getContractFactory("AirdropFactory");
  const AirdropHistory = await hre.ethers.getContractFactory("AirdropHistory");
  
  const airdropFactory = await AirdropFactory.deploy();
  await airdropFactory.deployed();

  const airdropHistory = await AirdropHistory.deploy(airdropFactory.address);
  await airdropFactory.deployed();

  await airdropFactory.setAirdropHistory(airdropHistory.address);

  console.log("AirdropFactory deployed to:", airdropFactory.address);
  console.log("AirdropHistory deployed to:", airdropHistory.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
