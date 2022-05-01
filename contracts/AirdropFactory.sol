//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./IERC20.sol";
import "./SafeMath.sol";

contract AirdropFactory {
    using SafeMath for uint256;
    
    uint256 immutable public gasForDistribution = 300000;

    IERC20 token;

    function sendTokens(
        address[] memory addresses_,
        uint256[] memory amounts_,
        IERC20 token_,
        uint256 gas_) external returns(uint256) {
        require(addresses_.length == amounts_.length, "Array must have the same length.");
        uint256 gasUsed = 0;
        uint256 gasLeft = gasleft();
        uint256 newGasLeft;
        uint256 iterations;
        while (gasUsed < gas_ && iterations < addresses_.length) {
            token_.transferFrom(msg.sender, addresses_[iterations], amounts_[iterations]);
            iterations++;
            newGasLeft = gasleft();

            if (gasLeft > newGasLeft) {
                gasUsed = gasUsed.add(gasLeft.sub(newGasLeft));
            }

            gasLeft = newGasLeft;
        }
        return iterations;
    }
}
