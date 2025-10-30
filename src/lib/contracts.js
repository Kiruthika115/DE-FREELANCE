import { ethers } from "ethers";
import DeFreeMarketplace from "./DeFreeMarketplace.json";
import ReputationNFT from "./ReputationNFT.json";

export const MARKETPLACE_ADDRESS = "0x124A7311F5F26bb45E90535BD44E59608F61E8ee";
export const NFT_ADDRESS = "0xeB6e8fFc3B18E8C94dD798a2Bda99994e791D11e";

export function getContracts(signerOrProvider) {
  const marketplace = new ethers.Contract(
    MARKETPLACE_ADDRESS,
    DeFreeMarketplace.abi,
    signerOrProvider
  );
  const nft = new ethers.Contract(NFT_ADDRESS, ReputationNFT.abi, signerOrProvider);
  return { marketplace, nft };
}
