import React from "react";
import { Link } from "react-router-dom";

export default function Header({ account, connectWallet, disconnectWallet }) {
  return (
    <header className="fixed top-0 left-0 w-full backdrop-blur-lg bg-white/10 border-b border-white/20 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
        
        {/* Logo / Title */}
        <div className="text-2xl font-extrabold text-purple-400 tracking-wide">
          DeFree <span className="text-white">🚀</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex gap-10 text-white text-lg font-semibold">
          <Link to="/" className="hover:text-purple-400 transition">Home</Link>
          <Link to="/create" className="hover:text-purple-400 transition">Create</Link>
          <Link to="/admin" className="hover:text-purple-400 transition">Admin</Link>
        </nav>

        {/* Wallet Button */}
        <div>
          {account ? (
            <button
              onClick={disconnectWallet}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-105 transition-transform text-white font-semibold px-4 py-2 rounded-xl shadow-lg"
            >
              Disconnect ({account.slice(0, 6)}...{account.slice(-4)})
            </button>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-105 transition-transform text-white font-semibold px-4 py-2 rounded-xl shadow-lg"
            >
              Connect Wallet
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
