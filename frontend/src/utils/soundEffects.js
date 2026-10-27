/**
 * AURA FINANCE — LUXURY FINTECH WEB AUDIO ENGINE
 * Synthesizes crystal-clear minted metallic coin clinks, cascading currency,
 * and encrypted vault chimes using procedural Web Audio API.
 * 100% zero-dependency, zero network latency, bank-grade audio precision.
 */

let audioCtx = null;
let isMuted = false;

// Safe lazy AudioContext initialization
function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Synthesizes a realistic minted metallic coin clink.
 * Uses high-Q resonant metallic harmonics (fundamental + detuned overtones)
 * with exponential amplitude decays.
 */
export function playCoinClink(options = {}) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const pitch = options.pitch || 1.0;
  const volume = (options.volume ?? 0.25) * 0.4; // Controlled, elegant loudness

  // Master Gain
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(volume, now);
  masterGain.connect(ctx.destination);

  // Metallic Resonant Frequencies (Simulating dense minted gold/silver coin)
  const frequencies = [
    2380 * pitch, // Fundamental coin ring
    3820 * pitch, // High overtone
    5240 * pitch, // Metallic edge shimmer
    1420 * pitch, // Core body tone
  ];

  frequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = idx === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Subtle pitch dip simulating the impact inertia
    osc.frequency.exponentialRampToValueAtTime(freq * 0.985, now + 0.08);

    // Decay rate: high frequencies decay faster, fundamental rings longer
    const decayDuration = idx === 0 ? 0.45 : idx === 1 ? 0.35 : 0.2;
    gain.gain.setValueAtTime(idx === 0 ? 0.6 : 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + decayDuration);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + decayDuration);
  });

  // Short noise burst on strike (metallic click)
  try {
    const bufferSize = ctx.sampleRate * 0.008; // 8ms noise click
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    // Highpass filter to make it crisp and metallic
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(4000, now);

    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.2, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);

    whiteNoise.connect(filter);
    filter.connect(clickGain);
    clickGain.connect(masterGain);

    whiteNoise.start(now);
  } catch (e) {
    // Graceful fallback if noise buffer unsupported
  }
}

/**
 * Cascading coins sound effect (multiple coins clinking together in sequence)
 */
export function playCoinCascade() {
  if (isMuted) return;

  const drops = [
    { delay: 0, pitch: 1.05, volume: 0.22 },
    { delay: 70, pitch: 1.18, volume: 0.28 },
    { delay: 150, pitch: 0.94, volume: 0.32 },
    { delay: 240, pitch: 1.25, volume: 0.26 },
    { delay: 360, pitch: 1.08, volume: 0.35 },
  ];

  drops.forEach(({ delay, pitch, volume }) => {
    setTimeout(() => {
      playCoinClink({ pitch, volume });
    }, delay);
  });
}

/**
 * Vault Activation Shimmer — ambient harmonic bell chord
 */
export function playVaultActivation() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.08, now);
  master.connect(ctx.destination);

  // A major pentatonic harmonic spread
  const notes = [554.37, 659.25, 880.0, 1108.73, 1318.51];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.06);

    gain.gain.setValueAtTime(0.001, now + i * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.15, now + i * 0.06 + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 1.2);

    osc.connect(gain);
    gain.connect(master);

    osc.start(now + i * 0.06);
    osc.stop(now + i * 0.06 + 1.25);
  });
}

export function toggleMute() {
  isMuted = !isMuted;
  return isMuted;
}

export function getMuteState() {
  return isMuted;
}
