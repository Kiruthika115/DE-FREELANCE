import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Admin from "./pages/Admin";
import Badges from"./pages/Badges";
import "../src/styles/globals.css";

export default function App() {
  const [account, setAccount] = useState(null);

  // 🪙 Connect or Change Wallet
 const connectOrChangeWallet = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }

  try {
    // 💡 Force MetaMask to open account selection popup
    const accounts = await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [{ eth_accounts: {} }],
    });

    // Re-request the selected account
    const accs = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accs[0]);
  } catch (err) {
    console.error("Wallet connect error:", err);
    alert("⚠️ Connection cancelled or failed.");
  }
};



  // ♻️ Auto-update when wallet changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accs) => setAccount(accs[0] || null));
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-gray-900 text-white flex flex-col font-sans">
        
        {/* 🌈 GLASS NAVBAR */}
        <header className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-lg border-b border-purple-500/30 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            
            {/* Logo */}
            <Link to="/" className="text-3xl font-extrabold text-purple-400 drop-shadow-lg">
              DeFree 🚀
            </Link>

            {/* Navigation */}
            <nav className="flex gap-8 text-lg font-semibold">
              <Link to="/" className="hover:text-purple-400 transition">Home</Link>
              <Link to="/create" className="hover:text-purple-400 transition">Create</Link>
              {/* <Link to="/admin" className="hover:text-purple-400 transition">Admin</Link> */}
              <Link to="/badges" className="hover:text-purple-400 transition">Badges</Link>

            </nav>

            {/* Wallet Button */}
            <button
              onClick={connectOrChangeWallet}
              className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 transition text-white px-5 py-2 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/30"
            >
              {account
                ? `Change (${account.slice(0, 5)}...${account.slice(-4)})`
                : "Connect Wallet"}
            </button>
          </div>
        </header>

        {/* 🪩 HERO / LANDING */}
        <section className="flex flex-col items-center justify-center text-center mt-32 px-6 py-20">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 mb-6 drop-shadow-lg">
            DeFree Marketplace
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            Empowering freelancers and clients through{" "}
            <span className="text-purple-400 font-semibold">trustless smart contracts.</span><br />
            Work. Earn. Trust. Repeat.
          </p>
          <Link
            to="/create"
            className="bg-purple-600 hover:bg-purple-700 transition text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-purple-500/30"
          >
            🚀 Start a Project
          </Link>
        </section>

        {/* 📦 PAGE CONTENT */}
        <main className="flex-grow flex flex-col items-center text-center px-6 py-16">
          <div className="w-full max-w-6xl">
            <Routes>
              <Route path="/" element={<Home account={account} />} />
              <Route path="/create" element={<Create />} />
              {/* <Route path="/admin" element={<Admin />} /> */}
              <Route path="/badges" element={<Badges account={account} />} />

            </Routes>
          </div>
        </main>

        {/* ⚡ FOOTER */}
        <footer className="text-center py-6 border-t border-purple-800/30 text-gray-400 backdrop-blur-md">
          Built with 💜 on Ethereum
        </footer>
      </div>
    </Router>
  );
}
