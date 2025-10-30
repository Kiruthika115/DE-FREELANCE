// src/components/ProjectCard.jsx
import React, { useState } from "react";
import { ethers } from "ethers";
import DeFreeMarketplace from "../lib/DeFreeMarketplace.json";

const marketplaceAddress = import.meta.env.VITE_MARKETPLACE_ADDRESS;

export default function ProjectCard({ project, account, reload }) {
  const { id, client, freelancer, amount, status } = project;
  const [loading, setLoading] = useState(false);

  const connectContract = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(marketplaceAddress, DeFreeMarketplace.abi, signer);
  };

  const handleTransaction = async (action, message) => {
    try {
      setLoading(true);
      const contract = await connectContract();
      const tx = await contract[action](id);
      await tx.wait();

      alert(`✅ ${message}`);
      reload();
    } catch (err) {
      console.error(err);
      alert(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isClient = account?.toLowerCase() === client.toLowerCase();
  const isFreelancer = account?.toLowerCase() === freelancer.toLowerCase();

  const statusLabel = ["Open", "In Progress", "Completed", "Cancelled"][status] || "Unknown";

  return (
    <div className="bg-gradient-to-br from-purple-950 via-gray-900 to-black p-6 rounded-2xl border border-purple-700/40 shadow-lg transition hover:shadow-purple-500/30 hover:scale-[1.02] duration-200">
      <h3 className="text-xl font-bold text-purple-300 mb-2">🚀 Project #{id}</h3>
      <p>👤 <span className="text-gray-400">Client:</span> {client}</p>
      <p>💼 <span className="text-gray-400">Freelancer:</span> {freelancer}</p>
      <p>💰 <span className="text-gray-400">Amount:</span> {amount} ETH</p>
      <p>📊 <span className="text-gray-400">Status:</span> <span className="font-semibold text-purple-400">{statusLabel}</span></p>

      <div className="flex gap-3 mt-4 flex-wrap">
        {statusLabel === "Open" && isFreelancer && (
          <button
            disabled={loading}
            onClick={() => handleTransaction("startWork", "Work started!")}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl transition"
          >
            {loading ? "Starting..." : "Start Work"}
          </button>
        )}

        {statusLabel === "In Progress" && isClient && (
          <button
            disabled={loading}
            onClick={() => handleTransaction("markCompleted", "Project marked as completed!")}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl transition"
          >
            {loading ? "Completing..." : "Mark Completed"}
          </button>
        )}

        {statusLabel === "Open" && isClient && (
          <button
            disabled={loading}
            onClick={() => handleTransaction("cancelProject", "Project cancelled!")}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition"
          >
            {loading ? "Cancelling..." : "Cancel Project"}
          </button>
        )}
      </div>
    </div>
  );
}
