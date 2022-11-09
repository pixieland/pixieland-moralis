import React from 'react'
import { ethers } from 'ethers'

export default function Marketplace({ contractNFT }) {
  const buyNFT = async () => {
    try{
      const transaction = await contractNFT.buyNFT({ value: ethers.utils.parseEther("0.00001"), gasLimit: 1e6});
      const tx = await transaction.wait();
      console.log(tx);
    }
    catch(err) {
      console.error(err);
    }
  }
  return (
    <div className="container">
      <h1>Marketplace</h1>
      <button className="btn btn-danger" onClick={buyNFT}>
        Buy NFT
      </button>
    </div>
  )
}