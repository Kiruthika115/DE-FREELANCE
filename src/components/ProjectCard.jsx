import React from "react";
import { ethers } from "ethers";
import marketplaceAbi from "../lib/DeFreeMarketplace.json";
import { toast } from "react-hot-toast";

export default function ProjectCard({ project, badgeCount }) {
  const marketplaceAddress = import.meta.env.VITE_MARKETPLACE_ADDRESS;

  const handleTransaction = async (id, action) => {
    try {
      if (!window.ethereum) return toast.error("Connect wallet first ✅");

      if (!marketplaceAddress) return toast.error("❌ Contract address missing in .env");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        marketplaceAddress,
        marketplaceAbi.abi,
        signer
      );

      let tx;

      if (action === "start") tx = await contract.startWork(id);
      if (action === "cancel") tx = await contract.cancelProject(id);
      if (action === "complete") {
        tx = await contract.markCompleted(
          id,
          `https://gateway.pinata.cloud/ipfs/QmNFTBadgeURIExample${id}`
        );
      }

      await tx.wait();
      toast.success("✅ Transaction confirmed!");

      if (action === "complete") {
        toast.success("🎖 NFT Reputation Badge Earned!");
      }

      setTimeout(() => window.location.reload(), 1000);
    } catch (e) {
      console.error(e);
      toast.error("❌ Transaction failed");
    }
  };

  return (
    <div
      className="w-full p-6 mb-6 rounded-2xl 
      bg-gradient-to-br from-[#1a1325] via-[#231b38] to-[#0e0716]
      border border-purple-500/40 
      shadow-2xl text-white backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-extrabold">Project #{project.id}</h2>

        <span className="text-sm bg-gradient-to-r from-purple-600 to-pink-500 px-3 py-1 rounded-lg shadow-lg font-semibold">
          🎖 {badgeCount} Badge{badgeCount !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 text-[15px] mb-4 break-words">
  <p className="flex gap-2">
    <span className="text-purple-400 font-semibold">Client:</span>
    <span className="truncate max-w-[200px] inline-block">{project.client}</span>
  </p>

  <p className="flex gap-2">
    <span className="text-purple-400 font-semibold">Freelancer:</span>
    <span className="truncate max-w-[200px] inline-block">{project.freelancer}</span>
  </p>

  <p>
    <span className="text-purple-400 font-semibold">Amount:</span>{" "}
    {ethers.formatEther(project.amount)} ETH
  </p>

  <p>
    <span className="text-purple-400 font-semibold">Status:</span>{" "}
    {project.status}
  </p>
</div>


      {/* Buttons */}
      <div className="mt-3 flex flex-wrap gap-3">
        {project.status === "Open" && (
          <>
            <button
              onClick={() => handleTransaction(project.id, "start")}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-105 transition-transform text-white font-semibold px-4 py-2 rounded-xl shadow-lg"
            >
              🚀 Start Work
            </button>

            <button
              onClick={() => handleTransaction(project.id, "cancel")}
              className="bg-red-600 hover:bg-red-700 hover:scale-105 transition-transform text-white font-semibold px-4 py-2 rounded-xl shadow-lg"
            >
              ❌ Cancel
            </button>
          </>
        )}

        {project.status === "InProgress" && (
          <button
            onClick={() => handleTransaction(project.id, "complete")}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-105 transition-transform text-white font-semibold px-4 py-2 rounded-xl shadow-lg"
          >
            ✅ Mark Completed
          </button>
        )}
      </div>
    </div>
  );
}
