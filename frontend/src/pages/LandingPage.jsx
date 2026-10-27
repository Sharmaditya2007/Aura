import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  TrendingUp,
  Shield,
  PieChart,
  Repeat,
  FileSpreadsheet,
  Lock,
  ArrowUpRight,
  Sparkles,
  Layers,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-white selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 overflow-hidden bg-radial-gradient">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171717] border border-[#2e2e2e] text-xs font-mono text-[#A3A3A3] mb-6 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>AURA FINANCE OS v1.0 • PRECISION LEDGER</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6"
            >
              Take Control of Your Money.
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-xl text-[#A3A3A3] leading-relaxed max-w-2xl mx-auto mb-10"
            >
              Track every dollar of income, allocate category budgets with automated threshold warnings, and schedule recurring cash flows inside an uncompromising black-and-white fintech workspace.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                <span>{isAuthenticated ? 'Open Dashboard' : 'Get Started Free'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
              <Link
                to={isAuthenticated ? '/dashboard' : '/login'}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#171717] border border-[#2e2e2e] text-white font-semibold text-sm hover:border-white/50 transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Live Platform</span>
                <ArrowUpRight className="w-4 h-4 text-[#A3A3A3]" />
              </Link>
            </motion.div>
          </div>

          {/* Luxury Dashboard Showcase Preview with Floating Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 relative max-w-5xl mx-auto"
          >
            {/* Ambient Back Glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-white/10 via-transparent to-transparent blur-xl pointer-events-none" />

            {/* Main Mockup Card */}
            <div className="relative rounded-2xl bg-[#111111] border border-[#2e2e2e] shadow-2xl p-6 sm:p-8 overflow-hidden">
              {/* Window Controls */}
              <div className="flex items-center justify-between pb-6 border-b border-[#242424] mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#2a2a2a]" />
                  <div className="w-3 h-3 rounded-full bg-[#2a2a2a]" />
                  <div className="w-3 h-3 rounded-full bg-[#2a2a2a]" />
                  <span className="ml-3 text-xs font-mono text-[#525252]">aura-finance.internal/overview</span>
                </div>
                <div className="px-2.5 py-1 rounded bg-[#1a1a1a] border border-[#292929] text-[10px] font-mono text-[#888888]">
                  ENCRYPTED TENANT • LIVE
                </div>
              </div>

              {/* Sample Metrics Mock Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-[#171717] border border-[#262626]">
                  <div className="text-[10px] uppercase font-mono text-[#737373] mb-1">Total Income</div>
                  <div className="text-xl font-bold font-mono text-white">$12,450.00</div>
                  <div className="text-[10px] font-mono text-fintech-green mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +14.2% vs last mo
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#171717] border border-[#262626]">
                  <div className="text-[10px] uppercase font-mono text-[#737373] mb-1">Total Expenses</div>
                  <div className="text-xl font-bold font-mono text-white">$3,820.40</div>
                  <div className="text-[10px] font-mono text-[#737373] mt-1">-4.8% vs last mo</div>
                </div>
                <div className="p-4 rounded-xl bg-[#171717] border border-[#262626]">
                  <div className="text-[10px] uppercase font-mono text-[#737373] mb-1">Net Cash Flow</div>
                  <div className="text-xl font-bold font-mono text-white">$8,629.60</div>
                  <div className="text-[10px] font-mono text-white/70 mt-1">69.3% savings rate</div>
                </div>
                <div className="p-4 rounded-xl bg-[#171717] border border-[#262626]">
                  <div className="text-[10px] uppercase font-mono text-[#737373] mb-1">Remaining Budget</div>
                  <div className="text-xl font-bold font-mono text-white">$1,179.60</div>
                  <div className="text-[10px] font-mono text-fintech-green mt-1">Within safe limits</div>
                </div>
              </div>

              {/* Interactive Mock Graph Area */}
              <div className="h-44 bg-[#141414] border border-[#242424] rounded-xl p-4 flex items-end justify-between gap-3">
                {[
                  { label: 'May', inc: 70, exp: 35 },
                  { label: 'Jun', inc: 85, exp: 40 },
                  { label: 'Jul', inc: 65, exp: 45 },
                  { label: 'Aug', inc: 95, exp: 50 },
                  { label: 'Sep', inc: 90, exp: 38 },
                  { label: 'Oct', inc: 100, exp: 32 },
                ].map((col, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1.5 h-32">
                      <div className="w-1/2 bg-white rounded-t transition-all hover:bg-white/90" style={{ height: `${col.inc}%` }} />
                      <div className="w-1/2 bg-[#333333] rounded-t transition-all hover:bg-[#444444]" style={{ height: `${col.exp}%` }} />
                    </div>
                    <span className="text-[10px] font-mono text-[#737373]">{col.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Live Transaction Badge 1 (Top Left) */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="hidden lg:flex absolute -top-6 -left-8 p-3.5 rounded-2xl bg-[#171717]/95 border border-[#383838] shadow-2xl items-center gap-3 backdrop-blur-md"
            >
              <div className="w-9 h-9 rounded-xl bg-fintech-greenSubtle border border-fintech-green/30 flex items-center justify-center text-fintech-green">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Client Wire Transfer</div>
                <div className="text-[11px] font-mono text-fintech-green font-bold">+$4,200.00 • Salary</div>
              </div>
            </motion.div>

            {/* Floating Live Transaction Badge 2 (Bottom Right) */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 1 }}
              className="hidden lg:flex absolute -bottom-6 -right-6 p-3.5 rounded-2xl bg-[#171717]/95 border border-[#383838] shadow-2xl items-center gap-3 backdrop-blur-md"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Dining & Coffee Budget</div>
                <div className="text-[11px] font-mono text-[#A3A3A3]">48% consumed • $240 remaining</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="py-24 border-t border-[#292929] bg-[#0c0c0c]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#737373]">Engineered for Control</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4 tracking-tight">
              A Complete Financial Operating System
            </h2>
            <p className="text-sm text-[#A3A3A3] leading-relaxed">
              Every tool you need to track, budget, automate, and analyze your wealth with zero fluff.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="fintech-card p-8 flex flex-col justify-between hover-glow">
              <div className="w-11 h-11 rounded-xl bg-[#1f1f1f] border border-[#2e2e2e] flex items-center justify-center text-white mb-6">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">High-Precision Ledger</h3>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  Store exact monetary amounts with Decimal128 precision. Avoid floating-point truncation errors forever.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="fintech-card p-8 flex flex-col justify-between hover-glow">
              <div className="w-11 h-11 rounded-xl bg-[#1f1f1f] border border-[#2e2e2e] flex items-center justify-center text-white mb-6">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Smart Category Reassignment</h3>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  Delete custom categories safely. Reassign referencing transactions automatically or archive categories to preserve history.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="fintech-card p-8 flex flex-col justify-between hover-glow">
              <div className="w-11 h-11 rounded-xl bg-[#1f1f1f] border border-[#2e2e2e] flex items-center justify-center text-white mb-6">
                <PieChart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Threshold Budget Alerts</h3>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  Set monthly caps per category. Get immediate in-app and email notifications before you overspend.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="fintech-card p-8 flex flex-col justify-between hover-glow">
              <div className="w-11 h-11 rounded-xl bg-[#1f1f1f] border border-[#2e2e2e] flex items-center justify-center text-white mb-6">
                <Repeat className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Scheduled Automation</h3>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  Define weekly, monthly, or yearly rules. The Spring scheduler executes due transactions with duplicate prevention.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="fintech-card p-8 flex flex-col justify-between hover-glow">
              <div className="w-11 h-11 rounded-xl bg-[#1f1f1f] border border-[#2e2e2e] flex items-center justify-center text-white mb-6">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">RFC4180 CSV Export</h3>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  Export your complete transaction history or custom date ranges directly into CSV format for tax and accounting.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="fintech-card p-8 flex flex-col justify-between hover-glow">
              <div className="w-11 h-11 rounded-xl bg-[#1f1f1f] border border-[#2e2e2e] flex items-center justify-center text-white mb-6">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Isolated Tenancy & Role Security</h3>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  Your financial ledger is strictly isolated by user ID in MongoDB. Full administrator console with audit logs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 border-t border-[#292929] bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#737373]">Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4 tracking-tight">
              Three Steps to Complete Financial Clarity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#111111] border border-[#292929]">
              <div className="text-2xl font-mono font-bold text-white/30 mb-4">01</div>
              <h3 className="text-lg font-bold text-white mb-2">Create Account & Ledger</h3>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Sign up in seconds. Your account comes pre-seeded with 16 system income and expense categories.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#111111] border border-[#292929]">
              <div className="text-2xl font-mono font-bold text-white/30 mb-4">02</div>
              <h3 className="text-lg font-bold text-white mb-2">Track & Set Budgets</h3>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Log daily transactions or schedule recurring rules. Set category spending limits with custom threshold warnings.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#111111] border border-[#292929]">
              <div className="text-2xl font-mono font-bold text-white/30 mb-4">03</div>
              <h3 className="text-lg font-bold text-white mb-2">Review Insights & Export</h3>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Inspect 6-month trends, category breakdown charts, and export compliant CSV reports whenever you need them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 border-t border-[#292929] bg-[#0c0c0c]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#171717] border border-[#2e2e2e] flex items-center justify-center text-white mx-auto mb-6">
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#737373]">Data Integrity & Privacy</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4 tracking-tight">
            Built with Zero Compromise
          </h2>
          <p className="text-sm text-[#A3A3A3] leading-relaxed max-w-2xl mx-auto mb-10">
            AURA Finance never sells user data, never uses external analytics trackers, and enforces server-side tenant isolation on every single MongoDB query.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-5 rounded-xl bg-[#141414] border border-[#262626]">
              <div className="flex items-center gap-2 text-white text-xs font-bold mb-1">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>BCrypt Password Hashing</span>
              </div>
              <p className="text-[11px] text-[#737373]">Passwords are never stored in plain text or visible in logs.</p>
            </div>
            <div className="p-5 rounded-xl bg-[#141414] border border-[#262626]">
              <div className="flex items-center gap-2 text-white text-xs font-bold mb-1">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Stateless 256-bit JWTs</span>
              </div>
              <p className="text-[11px] text-[#737373]">Cryptographically verified bearer tokens with 24-hour expiration.</p>
            </div>
            <div className="p-5 rounded-xl bg-[#141414] border border-[#262626]">
              <div className="flex items-center gap-2 text-white text-xs font-bold mb-1">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Admin Audit Logging</span>
              </div>
              <p className="text-[11px] text-[#737373]">Sensitive administrative actions are logged with timestamp and IP.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 border-t border-[#292929] bg-[#080808] relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Ready to Take Control of Your Money?
          </h2>
          <p className="text-sm sm:text-base text-[#A3A3A3] max-w-xl mx-auto mb-8">
            Experience the luxury of complete financial clarity with AURA Finance today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            >
              Create Your Free Account
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#171717] border border-[#2e2e2e] text-white font-semibold text-sm hover:border-white/50 transition-all"
            >
              Sign In to Existing Ledger
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
