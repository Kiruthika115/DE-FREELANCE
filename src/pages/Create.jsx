import React, { useState } from "react";
import { ethers } from "ethers";
import marketplaceArtifact from "../lib/DeFreeMarketplace.json"; // ✅ Import the compiled artifact

const MARKETPLACE_ABI = marketplaceArtifact.abi;
const MARKETPLACE_ADDRESS = import.meta.env.VITE_MARKETPLACE_ADDRESS; // ✅ from your .env.local

export default function Create() {
  const [freelancer, setFreelancer] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!window.ethereum) return alert("Install MetaMask first!");

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        MARKETPLACE_ADDRESS,
        MARKETPLACE_ABI,
        signer
      );

      const tx = await contract.createProject(freelancer, {
        value: ethers.parseEther(amount),
      });

      await tx.wait();
      alert("✅ Project created successfully!");
      setFreelancer("");
      setAmount("");
    } catch (err) {
      console.error(err);
      alert("❌ Transaction failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-16 space-y-6">
      <h2 className="text-4xl font-bold text-purple-400 mb-4">
        🚀 Create a New Project
      </h2>

      <input
        type="text"
        placeholder="Freelancer Wallet Address"
        value={freelancer}
        onChange={(e) => setFreelancer(e.target.value)}
        className="p-3 rounded-lg bg-gray-800 border border-purple-700 w-96 text-white placeholder-gray-400"
      />

      <input
        type="text"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="p-3 rounded-lg bg-gray-800 border border-purple-700 w-96 text-white placeholder-gray-400"
      />

      <button
        onClick={handleCreate}
        disabled={loading}
        className={`px-6 py-3 rounded-xl font-semibold transition-all ${
          loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        {loading ? "⏳ Creating..." : "🚀 Create Project"}
      </button>
    </div>
  );
}
