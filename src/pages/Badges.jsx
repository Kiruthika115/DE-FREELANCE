import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getContracts } from "../lib/contracts";

export default function Badges({ account }) {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account) loadBadges();
  }, [account]);

  const loadBadges = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const { nft } = getContracts(await provider.getSigner());

      const balance = await nft.balanceOf(account);
      const items = [];

      // Loop through owned NFTs
      for (let i = 0; i < Number(balance); i++) {
        const tokenId = i + 1; // simple increment since your contract mints sequentially
        try {
          const tokenURI = await nft.tokenURI(tokenId);
          const metaURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
          const metadata = await fetch(metaURL).then((res) => res.json());

          items.push({
            id: tokenId,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
          });
        } catch (err) {
          console.warn("Skipping token", i, err);
        }
      }

      setBadges(items);
    } catch (err) {
      console.error("❌ Failed to load badges:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 text-center">
      <h2 className="text-3xl font-bold text-purple-400 mb-6">🏆 Your DeFree Badges</h2>

      {loading ? (
        <p className="text-gray-400 animate-pulse">Loading badges...</p>
      ) : badges.length === 0 ? (
        <p className="text-gray-400">No badges yet — complete a project to earn one!</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {badges.map((b) => (
            <div
              key={b.id}
              className="bg-gradient-to-br from-purple-800 to-indigo-900 p-5 rounded-2xl shadow-lg border border-purple-700 hover:scale-105 transition"
            >
              <img src={b.image} alt={b.name} className="rounded-xl mb-4" />
              <p className="text-white font-semibold">{b.name}</p>
              <p className="text-gray-400 text-sm">{b.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
