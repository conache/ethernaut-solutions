// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "hardhat/console.sol";

contract GatekeeperOne {
    using SafeMath for uint256;
    address public entrant;

    modifier gateOne() {
        require(msg.sender != tx.origin);
        _;
    }

    modifier gateTwo() {
        require(gasleft().mod(8191) == 0);
        _;
    }

    modifier gateThree(bytes8 _gateKey) {
        require(
            uint32(uint64(_gateKey)) == uint16(uint64(_gateKey)),
            "GatekeeperOne: invalid gateThree part one"
        );
        require(
            uint32(uint64(_gateKey)) != uint64(_gateKey),
            "GatekeeperOne: invalid gateThree part two"
        );
        require(
            uint32(uint64(_gateKey)) == uint16(tx.origin),
            "GatekeeperOne: invalid gateThree part three"
        );
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

    function testGateOne() public {
        console.log(msg.sender != tx.origin);
    }
}

contract GateKeeperHack {
    using SafeMath for uint256;
    GatekeeperOne private gateKeeper;

    constructor(address _gateKeeper) public {
        gateKeeper = GatekeeperOne(_gateKeeper);
    }

    function tryEnter(bytes8 _gateKey) public {
        console.log(gasleft());
        console.log(uint256(0).mod(8191));
        gateKeeper.testGateOne();
        // gateKeeper.enter(bytes8(_gateKey));
    }
}
