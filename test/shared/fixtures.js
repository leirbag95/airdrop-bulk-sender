const { ethers } = require("hardhat");
const { deployMockUsDc } = require('./erc20-mock');

const airdropFixture = async (
  signers
) => {
  const deployer = signers[0];
  const airdropFactory = await ethers.getContractFactory(
    `AirdropFactory`
  );
  const airdrop = (await airdropFactory
    .connect(deployer)
    .deploy());

  const historyFactory = await ethers.getContractFactory(
      'AirdropHistory'
  );
  const history = await historyFactory.connect(deployer).deploy(airdrop.address);

  await airdrop.deployed();
  const erc20 = await deployMockUsDc(deployer);

  return { airdropFactory: airdrop, erc20, airdropHistory: history };
};

module.exports = {
  airdropFixture
}