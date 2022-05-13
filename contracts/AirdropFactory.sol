//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./IERC20.sol";
import "./SafeMath.sol";
import './AirdropHistory.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

contract AirdropFactory is Ownable {
    using SafeMath for uint256;
    
    uint256 immutable public gasForDistribution = 300000;

    IERC20 token;
    AirdropHistory airdropHistory;

    event AirdropSent(uint256 iterations, address indexed source);
    /**
     * Sends the tokens to several addresses by managing the provided gas
     * @param addresses_ array of addresses
     * @param amounts_ array of respective amounts in the address list
     * @param token_ used to airdrop
     * @param gas_ amount of gas used for the distribution of tokens
     */
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
        emit AirdropSent(iterations, msg.sender);
    }

    function setAirdropHistory(AirdropHistory _airdropHistory) external onlyOwner {
        airdropHistory = _airdropHistory;
    }
}
