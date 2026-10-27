import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ArrowUpRight, IndianRupee } from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#080808]/85 backdrop-blur-md border-b border-[#292929]/70 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#171717] border border-[#292929] flex items-center justify-center text-white group-hover:border-white/50 transition-colors">
            <IndianRupee className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-wider text-white font-sans flex items-center gap-1.5">
              AURA
              <span className="text-[10px] tracking-widest uppercase bg-white/10 text-[#A3A3A3] px-1.5 py-0.5 rounded font-mono">FINANCE</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A3A3A3]">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#budgeting" className="hover:text-white transition-colors">Budgets</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
        </div>

        {/* CTA Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              Dashboard
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-[#A3A3A3] hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#A3A3A3] hover:text-white transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111111] border-b border-[#292929] px-6 py-6 flex flex-col gap-4">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base text-[#A3A3A3] hover:text-white"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base text-[#A3A3A3] hover:text-white"
          >
            How It Works
          </a>
          <a
            href="#budgeting"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base text-[#A3A3A3] hover:text-white"
          >
            Budgets
          </a>
          <a
            href="#security"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base text-[#A3A3A3] hover:text-white"
          >
            Security
          </a>
          <div className="pt-4 border-t border-[#292929] flex flex-col gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-white text-black font-semibold text-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-[#292929] text-white text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-white text-black font-semibold text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
