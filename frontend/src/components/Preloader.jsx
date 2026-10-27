import React, { useState, useEffect, useRef } from 'react';
import { IndianRupee } from 'lucide-react';
import api from '../services/api';
import './Preloader.css';

/**
 * THE WEALTH PULSE — LUXURY FINTECH PRELOADER
 *
 * Sequence:
 * 1. Black Screen Reveal: Glowing center dot & floating atmospheric micro-particles.
 * 2. The Money Flow: Financial spline curve drawing dynamic wealth peaks and dips.
 * 3. The Coin Formation: Geometric monochrome discs tumble in CSS 3D space and converge.
 * 4. Logo Reveal: Emblem resolves into luxury finance badge with "EXPENSE TRACKER"
 *    and tagline "Every rupee. Under control."
 * 5. Financial Pulse: Laser pulse track with smooth 00% -> 100% progress counter.
 * 6. Dashboard Transition: Elevation, diagonal silver light sweep, and cinematic mask dissolve.
 */
export const Preloader = ({ onFinish }) => {
  // Choreography sequence phases: 'DOT' | 'FLOW' | 'COINS' | 'LOGO' | 'EXIT'
  const [phase, setPhase] = useState('DOT');
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING LEDGER');
  const [showLightSweep, setShowLightSweep] = useState(false);
  const [isExitTransitioning, setIsExitTransitioning] = useState(false);

  // App readiness tracker
  const isAppReadyRef = useRef(false);
  const animationFinishedRef = useRef(false);

  // 1. Accessibility: Check prefers-reduced-motion
  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        onFinish?.();
      }
    } catch (e) {
      // Fallback for environments lacking matchMedia
    }
  }, [onFinish]);

  // 2. Coordinate with actual application & backend readiness
  useEffect(() => {
    let isMounted = true;

    const checkReadiness = async () => {
      try {
        const storedToken = localStorage.getItem('aura_token');
        if (storedToken) {
          // Verify authentication session with backend
          await api.get('/auth/me', { timeout: 3500 });
        } else {
          // For guests, ping categories or fast endpoint to confirm connectivity
          await api.get('/categories', { timeout: 3000 }).catch(() => null);
        }
      } catch (err) {
        // Non-essential error tolerance: do not block the application
      } finally {
        if (isMounted) {
          isAppReadyRef.current = true;
        }
      }
    };

    checkReadiness();

    // Safety fallback: Never keep the user trapped longer than 4.2 seconds
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        isAppReadyRef.current = true;
      }
    }, 4200);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, []);

  // 3. Orchestrate the cinematic timeline stages
  useEffect(() => {
    const timers = [];

    // Stage 1 -> 2: Money Flow curve begins (0.75s)
    timers.push(
      setTimeout(() => {
        setPhase('FLOW');
        setStatusText('MAPPING FINANCIAL FLOWS');
      }, 750)
    );

    // Stage 2 -> 3: 3D Coin Discs converge (1.9s)
    timers.push(
      setTimeout(() => {
        setPhase('COINS');
        setStatusText('ASSEMBLING CAPITAL EMBLEM');
      }, 1900)
    );

    // Stage 3 -> 4: Logo Reveal & Financial Pulse (2.7s)
    timers.push(
      setTimeout(() => {
        setPhase('LOGO');
        setStatusText('CALIBRATING WEALTH PULSE');
      }, 2700)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  // 4. Smooth percentage progress engine (00% -> 100%)
  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      // If we are reaching 88-92% and the backend is still initializing, gracefully wait
      if (currentProgress >= 90 && !isAppReadyRef.current) {
        setStatusText('SYNCHRONIZING WITH VAULT');
        return;
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setStatusText('SYSTEM SYNCHRONIZED');
        animationFinishedRef.current = true;
        triggerCompletion();
        return;
      }

      // Smooth organic increment
      const step = phase === 'LOGO' ? Math.max(1, (100 - currentProgress) / 5) : 3;
      currentProgress = Math.min(100, currentProgress + step);
      setProgress(Math.round(currentProgress));
    }, 40);

    const triggerCompletion = () => {
      // Trigger subtle diagonal silver light sweep
      setShowLightSweep(true);

      // Begin cinematic upward elevation and mask dissolve (350ms after 100%)
      setTimeout(() => {
        setIsExitTransitioning(true);

        // Hand over cleanly to the dashboard / homepage (750ms after mask dissolves)
        setTimeout(() => {
          onFinish?.();
        }, 750);
      }, 350);
    };

    return () => {
      clearInterval(interval);
    };
  }, [phase, onFinish]);

  // Generate deterministic atmospheric floating particles
  const particles = [
    { top: '18%', left: '15%', size: 3, delay: '0s' },
    { top: '25%', left: '82%', size: 2, delay: '1.2s' },
    { top: '68%', left: '12%', size: 2.5, delay: '2.5s' },
    { top: '75%', left: '78%', size: 3, delay: '0.8s' },
    { top: '40%', left: '22%', size: 2, delay: '3.1s' },
    { top: '55%', left: '88%', size: 2.5, delay: '1.8s' },
    { top: '85%', left: '45%', size: 2, delay: '2.0s' },
  ];

  return (
    <div
      className={`wealth-pulse-overlay ${isExitTransitioning ? 'exit-transition' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Expense Tracker"
    >
      {/* Subtle Radial Ambient Glow */}
      <div className="wealth-pulse-ambient" />

      {/* Subtle Film Grain Noise Overlay */}
      <div className="wealth-pulse-grain" />

      {/* Floating Micro-Particles Field */}
      <div className="particle-field">
        {particles.map((p, idx) => (
          <div
            key={idx}
            className="particle"
            style={{
              top: p.top,
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Diagonal Light Sweep (Phase 6) */}
      {showLightSweep && <div className="diagonal-light-sweep" />}

      {/* Main Stage Choreography */}
      <div className="stage-container">
        {/* Phase 1: Center Glowing Dot */}
        {phase === 'DOT' && <div className="center-luminous-dot" />}

        {/* Phase 2: The Money Flow Financial Chart */}
        {(phase === 'FLOW' || phase === 'COINS') && (
          <div className="money-flow-chart">
            <svg viewBox="0 0 480 140" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="moneyFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                  <stop offset="40%" stopColor="#e4e4e7" stopOpacity="0.7" />
                  <stop offset="70%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              {/* Background Reference Track */}
              <path
                d="M 20,110 Q 80,110 130,55 T 230,85 T 330,35 T 410,65 T 465,20"
                className="flow-path-bg"
              />
              {/* Active Luminous Flow Curve */}
              <path
                d="M 20,110 Q 80,110 130,55 T 230,85 T 330,35 T 410,65 T 465,20"
                className="flow-path-active"
              />
            </svg>

            {/* Peak Financial Markers */}
            <div className="peak-marker" style={{ left: '27%', top: '39%' }} />
            <div className="peak-marker" style={{ left: '69%', top: '25%' }} />
            <div className="peak-marker" style={{ left: '97%', top: '14%' }} />
          </div>
        )}

        {/* Phase 3: The 3D Coin Formation */}
        {phase === 'COINS' && (
          <div className="coin-formation-stage">
            <div className="coin-disc coin-disc-1" />
            <div className="coin-disc coin-disc-2" />
            <div className="coin-disc coin-disc-3" />
            <div className="coin-disc coin-disc-4" />
            <div className="coin-disc coin-disc-5" />
            <div className="convergence-flash" />
          </div>
        )}

        {/* Phase 4 & 5: Minimal Finance Emblem, Brand Reveal & Financial Pulse */}
        {phase === 'LOGO' && (
          <div className={`logo-reveal-group ${isExitTransitioning ? 'elevate-exit' : ''}`}>
            {/* Luxury Geometric Financial Emblem */}
            <div className="fintech-luxury-emblem">
              <div className="emblem-outer-ring" />
              <div className="emblem-core-shield">
                <IndianRupee className="emblem-rupee-glyph" strokeWidth={2.5} />
              </div>
            </div>

            {/* Brand Title */}
            <h1 className="brand-name-title">EXPENSE TRACKER</h1>

            {/* Tagline */}
            <p className="brand-tagline">“Every rupee. Under control.”</p>

            {/* Financial Pulse Progress Track */}
            <div className="financial-pulse-container">
              <div className="pulse-track">
                <div
                  className="pulse-bar"
                  style={{ width: `${progress}%` }}
                >
                  <div className="pulse-spark" />
                </div>
              </div>

              {/* Status and Tabular Numeric Counter */}
              <div className="pulse-readout">
                <span className="pulse-status">{statusText}</span>
                <span className="pulse-percentage">
                  {String(progress).padStart(2, '0')}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
