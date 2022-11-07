// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./tokens/PixieNFT.sol";
import "hardhat/console.sol";

contract PixielandNFTMarketplace is IERC721Receiver {
    PixieNFT public pixie;

    uint256 id;

    constructor() {
        pixie = new PixieNFT();
        pixie.mint(address(this), "");
        pixie.mint(address(this), "");
        pixie.mint(address(this), "");
        pixie.mint(address(this), "");
        pixie.mint(address(this), "");
    }

    function buyNFT() external payable returns (uint256) {
        require(msg.value >= 0, "Please send more Matic");
        uint256 currid = id;
        require(currid <= 4, "Max limit crossed");

        IERC721(pixie).safeTransferFrom(address(this), msg.sender, currid);

        id++;
        return currid;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
