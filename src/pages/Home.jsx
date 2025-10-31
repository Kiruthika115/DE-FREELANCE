import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import marketplaceAbi from "../lib/DeFreeMarketplace.json";
import nftAbi from "../lib/ReputationNFT.json";
import ProjectCard from "../components/ProjectCard";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [badges, setBadges] = useState({});
  const [connected, setConnected] = useState(false);

  const loadProjects = async () => {
    try {
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        import.meta.env.VITE_MARKETPLACE_ADDRESS,
        marketplaceAbi.abi,
        signer
      );

      const nft = new ethers.Contract(
        import.meta.env.VITE_NFT_ADDRESS,
        nftAbi.abi,
        signer
      );

      const count = await contract.projectCount();
      const items = [];
      const badgeMap = {};

      for (let i = 1; i <= count; i++) {
        const p = await contract.projects(i);

        const freelancer = p.freelancer;

        if (!badgeMap[freelancer]) {
          badgeMap[freelancer] = Number(await nft.balanceOf(freelancer));
        }

        items.push({
          id: i,
          client: p.client,
          freelancer,
          amount: p.amount.toString(),
          status: ["Open", "InProgress", "Completed", "Cancelled"][p.status],
        });
      }

      setProjects(items);
      setBadges(badgeMap);
      console.log("✅ Projects:", items);
      console.log("🎖 Badge counts:", badgeMap);

    } catch (err) {
      console.error("❌ Load failed:", err);
    }
  };

  const connectWallet = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    setConnected(true);
    loadProjects();
  };

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
      window.ethereum.on("accountsChanged", () => connectWallet());
    }
  }, []);

  return (
    <div >
      {/* <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        🚀 DeFree Marketplace
      </h1> */}

      {/* <p className="text-gray-400 mb-8">Empowering freelancers on Ethereum 💜</p> */}

      {!connected && (
        <button
          onClick={connectWallet}
          className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition"
        >
          🔗 Connect Wallet
        </button>
      )}

      <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.length > 0 ? (
          projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              badgeCount={badges[p.freelancer] ?? 0}
            />
          ))
        ) : (
          <p className="text-gray-500 text-lg">
            No projects yet... ✨ Start building!
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
