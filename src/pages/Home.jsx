import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContracts } from "../lib/contracts";
import ProjectCard from "../components/ProjectCard";

export default function Home({ account }) {
  const [projects, setProjects] = useState([]);
  const [showMine, setShowMine] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not detected!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const { marketplace } = getContracts(provider);

      const count = await marketplace.projectCount();
      console.log("📦 Total projects:", count.toString());

      const list = [];
      for (let i = 1; i <= count; i++) {
        const p = await marketplace.projects(i);
        list.push({
          id: i,
          client: p.client,
          freelancer: p.freelancer,
          amount: ethers.formatEther(BigInt(p.amount.toString())),

          status: Number(p.status),
        });
      }

      console.log("✅ Loaded projects:", list);
      setProjects(list.reverse());
    } catch (err) {
      console.error("❌ Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = showMine
    ? projects.filter((p) => p.client === account || p.freelancer === account)
    : projects;

  return (
    <div className="flex flex-col items-center w-full space-y-8 py-10">
      <button
        onClick={() => setShowMine(!showMine)}
        className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-3 rounded-xl text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
      >
        {showMine ? "Show All Projects" : "Show My Projects"}
      </button>

      {loading ? (
        <p className="text-gray-400 animate-pulse">Loading projects...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400">No projects found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
          {filtered.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              account={account}
              reload={loadProjects}
            />
          ))}
        </div>
      )}
    </div>
  );
}
