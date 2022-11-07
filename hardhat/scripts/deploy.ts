import { ethers } from "hardhat";

async function main() {
  
  const PixieNFT = await ethers.getContractFactory("PixieNFT");
  const pixieNFT = await PixieNFT.deploy();

  await pixieNFT.deployed();

  console.log(`pixieNFT address: ${pixieNFT.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
