import { waffle } from "hardhat";
import ERC_20_ABI from "../../abis/erc20.abi.json";

async function deployMockUsdc(deployer) {
  const erc20 = await waffle.deployMockContract(
    deployer,
    ERC_20_ABI
  );

  await erc20.mock.decimals.returns(18);
  await erc20.mock.name.returns(`Basic Coin`);
  await erc20.mock.symbol.returns(`BSC`);
  await erc20.mock.transferFrom.returns(true);

  return erc20;
}

module.exports = {
    deployMockUsdc
}