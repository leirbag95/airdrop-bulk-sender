//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./IERC20.sol";
import "./SafeMath.sol";

contract AirdropHistory {

    address public airdropFactory;

    struct Airdrop {
        string name;
        uint256 index;
        uint256 totalAddresses;
    }

    mapping(address => Airdrop[]) private airdrops;

    modifier onlySentry {
        require(msg.sender == airdropFactory, "Only Airdrop Factory contract is allowed.");
        _;
    }

    constructor (address _airdropFactory) {
        airdropFactory = _airdropFactory;
    }
    
    function newAirdrop(address _account, string memory name_, uint256 totalAddresses_)
    onlySentry external {
        airdrops[_account].push(Airdrop(name_, 0, totalAddresses_));
    }

    function getAirdropHistory(address account_) view external returns(Airdrop[] memory) {
        return airdrops[account_];
    }
}