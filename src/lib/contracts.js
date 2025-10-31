import { ethers } from "ethers";
import DeFreeMarketplace from "./DeFreeMarketplace.json";
import ReputationNFT from "./ReputationNFT.json";

export const MARKETPLACE_ADDRESS = "0x4920B07E8A44ab2083356Cf4da4c6981384167AB";
export const NFT_ADDRESS = "0xDc9d447D7e276Ff54431bFc829AD48EaAE0e9462";

export function getContracts(signerOrProvider) {
  const marketplace = new ethers.Contract(MARKETPLACE_ADDRESS, DeFreeMarketplace.abi, signerOrProvider);
  const nft = new ethers.Contract(NFT_ADDRESS, ReputationNFT.abi, signerOrProvider);
  return { marketplace, nft };
}
