import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ArrowRight,
  IndianRupee,
  KeyRound,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export const RegisterPage = () => {
  const { register, verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();

  // Step: 'FORM' | 'OTP'
  const [step, setStep] = useState('FORM');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Fields (6 digits)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');
  const otpInputRefs = useRef([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password strength calculation
  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthScore = calculateStrength(password);
  const getStrengthLabel = () => {
    if (strengthScore <= 1) return { label: 'Weak', color: 'bg-fintech-red', text: 'text-fintech-red' };
    if (strengthScore <= 3) return { label: 'Medium', color: 'bg-amber-400', text: 'text-amber-400' };
    return { label: 'Strong', color: 'bg-fintech-green', text: 'text-fintech-green' };
  };
  const strengthInfo = getStrengthLabel();

  // Cooldown countdown effect
  useEffect(() => {
    let timer;
    if (step === 'OTP' && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCooldown]);

  // Handle Initial Form Submission -> Send OTP
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await register(fullName, email, password, confirmPassword);
      if (res?.requiresVerification) {
        setStep('OTP');
        setResendCooldown(60);
        setCanResend(false);
        setOtpDigits(['', '', '', '', '', '']);
        setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Server is establishing connection. Please try again in a few moments.');
      } else if (err.response?.status === 409 || err.message?.toLowerCase().includes('already exists')) {
        setError('An account with this email address already exists. Please sign in below.');
      } else {
        const msg = err.response?.data?.message || err.message || 'Registration failed. Please check inputs.';
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // OTP Digit Change
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setError('');

    // Advance focus to next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify if all 6 digits entered
    const combinedOtp = newDigits.join('');
    if (combinedOtp.length === 6 && !newDigits.includes('')) {
      handleVerifyOtp(combinedOtp);
    }
  };

  // Backspace navigation
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Paste support (e.g. paste "492015")
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpDigits(digits);
      otpInputRefs.current[5]?.focus();
      handleVerifyOtp(pastedData);
    }
  };

  // Submit OTP Verification
  const handleVerifyOtp = async (otpCode) => {
    const code = otpCode || otpDigits.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verifyOtp(email, code);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Verification failed. Please check the code.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || resending) return;

    setResending(true);
    setError('');
    setResendSuccess('');

    try {
      await resendOtp(email);
      setResendSuccess('A fresh 6-digit code has been dispatched to your email.');
      setResendCooldown(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
      setTimeout(() => setResendSuccess(''), 4000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Could not resend OTP. Please wait and try again.';
      setError(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col justify-between p-6 bg-radial-gradient">
      {/* Top Brand Link */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#171717] border border-[#292929] flex items-center justify-center text-white">
            <IndianRupee className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-wider text-white">AURA FINANCE</span>
        </Link>
        <Link to="/" className="text-xs text-[#A3A3A3] hover:text-white transition-colors">
          ← Return to Home
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-md w-full mx-auto my-10">
        <div className="fintech-card p-8 shadow-2xl relative">
          {/* STEP 1: Registration Form */}
          {step === 'FORM' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">Create Account</h1>
                <p className="text-xs text-[#737373] mt-1.5">
                  Establish your private financial ledger on AURA
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3.5 rounded-xl bg-fintech-redSubtle border border-fintech-red/30 text-fintech-red text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-mono uppercase text-[#A3A3A3] mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111111] border border-[#292929] text-white text-sm focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-mono uppercase text-[#A3A3A3] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111111] border border-[#292929] text-white text-sm focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono uppercase text-[#A3A3A3]">
                      Password
                    </label>
                    {password && (
                      <span className={`text-[10px] font-mono ${strengthInfo.text}`}>
                        {strengthInfo.label}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#111111] border border-[#292929] text-white text-sm focus:outline-none focus:border-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737373] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength Bar */}
                  {password && (
                    <div className="grid grid-cols-5 gap-1.5 mt-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 rounded-full transition-all ${
                            strengthScore >= level ? strengthInfo.color : 'bg-[#222222]'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-mono uppercase text-[#A3A3A3] mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111111] border border-[#292929] text-white text-sm focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] disabled:opacity-50 mt-4"
                >
                  {loading ? (
                    <span>Dispatching Verification OTP...</span>
                  ) : (
                    <>
                      <span>Continue to Verification</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign In Link */}
              <div className="mt-6 text-center text-xs text-[#737373]">
                Already have an account?{' '}
                <Link to="/login" className="text-white font-semibold hover:underline">
                  Sign In
                </Link>
              </div>
            </>
          )}

          {/* STEP 2: 6-Digit Email OTP Verification Screen */}
          {step === 'OTP' && (
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#171717] border border-[#2e2e2e] flex items-center justify-center text-white mx-auto mb-4 shadow-sm">
                  <KeyRound className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">Verify Your Email</h1>
                <p className="text-xs text-[#737373] mt-2 leading-relaxed">
                  We have dispatched a 6-digit cryptographic security code to
                </p>
                <div className="mt-1 font-mono text-xs text-white bg-[#171717] border border-[#292929] py-1 px-3 rounded-lg inline-block">
                  {email}
                </div>
              </div>

              {error && (
                <div className="mb-6 p-3.5 rounded-xl bg-fintech-redSubtle border border-fintech-red/30 text-fintech-red text-xs">
                  {error}
                </div>
              )}

              {resendSuccess && (
                <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{resendSuccess}</span>
                </div>
              )}

              {/* 6 Digit Numeric Boxes */}
              <div className="my-6">
                <label className="block text-center text-[11px] font-mono uppercase tracking-widest text-[#737373] mb-3">
                  Enter 6-Digit Security Code
                </label>
                <div className="flex items-center justify-between gap-2" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className={`w-12 h-14 rounded-xl text-center text-xl font-mono font-bold bg-[#141416] border transition-all text-white focus:outline-none ${
                        digit
                          ? 'border-white bg-[#1b1b20] shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                          : 'border-[#292929] focus:border-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Verify Button */}
              <button
                type="button"
                disabled={loading || otpDigits.join('').length !== 6}
                onClick={() => handleVerifyOtp()}
                className="w-full py-3.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:opacity-40"
              >
                {loading ? (
                  <span>Verifying Code...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify & Activate Ledger</span>
                  </>
                )}
              </button>

              {/* Resend Code Controls */}
              <div className="mt-6 pt-4 border-t border-[#222222] flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStep('FORM');
                    setError('');
                  }}
                  className="text-[#737373] hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>

                <button
                  type="button"
                  disabled={!canResend || resending}
                  onClick={handleResendOtp}
                  className={`flex items-center gap-1.5 font-medium transition-colors ${
                    canResend
                      ? 'text-white hover:underline'
                      : 'text-[#525252] cursor-not-allowed'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                  {canResend ? (
                    <span>Resend Code</span>
                  ) : (
                    <span>Resend in {resendCooldown}s</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="text-center text-xs font-mono text-[#525252]">
        AURA Finance • Zero Advertising • End-to-End Tenancy
      </div>
    </div>
  );
};
export default RegisterPage;
