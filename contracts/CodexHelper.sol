// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract CodexHelper {
    function getCodexIndex(uint256 codexLen) public pure returns (uint256) {
        return 2**256 - 1 - uint256(keccak256(abi.encode(codexLen))) + 1;
    }
}
