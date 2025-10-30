import React, { useState } from "react";
import { getContracts } from "../lib/contracts";

export default function Admin() {
  const [to, setTo] = useState("");

  const mintNFT = async () => {
    try {
      const { reputationNFT } = await getContracts();
      const tx = await reputationNFT.mint(to);
      await tx.wait();
      alert(`✅ Minted Reputation NFT for ${to}`);
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Admin Panel</h2>
      <input
        placeholder="Recipient Address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <button
        onClick={mintNFT}
        className="bg-purple-600 text-white px-4 py-2 rounded w-full"
      >
        Mint Reputation NFT
      </button>
    </div>
  );
}
