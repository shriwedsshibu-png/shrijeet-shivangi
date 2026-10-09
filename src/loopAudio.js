// Gapless background music for the invitation.
// A plain <audio loop> leaves a tiny hiccup at the loop point (every MP3 carries a sliver of silence at
// its edges). Here the browser's audio engine loops exactly from the first to the last real note.
// If that engine is unavailable or the file cannot be decoded, it quietly falls back to <audio loop>.

const SILENT = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//NwwAAAAAAAAAAAAEluZm8AAAAPAAAAGQAABdAAKCgoMTExMTo6OjpDQ0NDTExMTFVVVVVeXl5eZ2dnZ3BwcHB5eXl5goKCgouLi4uUlJSUnZ2dnaampqavr6+vuLi4uMHBwcHKysrK09PT09zc3Nzl5eXl7u7u7vf39/f/////AAAAAExhdmM2MC4zMQAAAAAAAAAAAAAAACQCUgAAAAAAAAXQHwIDDAAAAAAAAAAAAAAAAAD/8yDEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV//MixCcAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVX/8yDETwAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVV//MgxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVf/zIMSdAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVX/8yLExAAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVf/zIMTYAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVX/8yDE2AAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV//MgxNgAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVf/zIsTXAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVV//MgxNgAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVf/zIMTYAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVX/8yDE2AAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV//MixNcAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVX/8yDE2AAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVV//MgxNgAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVf/zIMTYAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVX/8yLE1wAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVf/zIMTYAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVX/8yDE2AAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MgxNgAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zIsTXAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MgxNgAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zIMTYAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/8yDE2AAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';

export default function makeLoopPlayer(src, volume = 0.45) {
  const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
  let ctx = null, gain = null, buf = null, node = null, loopStart = 0, loopEnd = 0;
  let want = false, failed = !AC, started = false, el = null, keepAlive = null;
  const listeners = [];
  const emit = (ok) => listeners.splice(0).forEach((f) => f(ok));

  const fallback = () => {
    if (!el) { el = new Audio(src); el.loop = true; el.volume = volume; el.preload = 'auto'; }
    return el;
  };

  // let the music play even when an iPhone's silent switch is on (it is music the guest chose to start)
  const iosPlayback = () => {
    try { if (navigator.audioSession) { navigator.audioSession.type = 'playback'; return; } } catch (e) { /* ignore */ }
    const ios = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (ios && !keepAlive) { keepAlive = new Audio(SILENT); keepAlive.loop = true; keepAlive.play().catch(() => {}); }
  };

  const start = () => {
    if (!ctx || !buf || node) return;
    node = ctx.createBufferSource();
    node.buffer = buf; node.loop = true; node.loopStart = loopStart; node.loopEnd = loopEnd;
    node.connect(gain);
    const t = ctx.currentTime;
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(started ? volume : 0, t);
    if (!started) gain.gain.linearRampToValueAtTime(volume, t + 1.6); // soft entrance, only the very first time
    node.start(0, loopStart);
    started = true;
  };

  if (AC) {
    try {
      ctx = new AC(); gain = ctx.createGain(); gain.gain.value = 0; gain.connect(ctx.destination);
      fetch(src).then((r) => { if (!r.ok) throw new Error('no music'); return r.arrayBuffer(); })
        .then((ab) => new Promise((res, rej) => { const p = ctx.decodeAudioData(ab, res, rej); if (p && p.catch) p.catch(rej); }))
        .then((b) => {
          buf = b;
          // find the first and last real notes (skip the encoder's silent edges)
          const ch = b.getChannelData(0), n = ch.length, th = 1e-4;
          let i = 0; while (i < n && Math.abs(ch[i]) < th) i++;
          let j = n - 1; while (j > i && Math.abs(ch[j]) < th) j--;
          loopStart = i / b.sampleRate; loopEnd = (j + 1) / b.sampleRate;
          if (want) { start(); emit(true); }
        })
        .catch(() => { failed = true; if (want) fallback().play().then(() => emit(true)).catch(() => emit(false)); });
    } catch (e) { failed = true; }
  }

  return {
    // call from a tap; resolves true when music is (about to be) audible
    play() {
      want = true;
      if (failed || !ctx) return fallback().play().then(() => true);
      iosPlayback();
      const r = ctx.resume ? ctx.resume() : Promise.resolve();
      return Promise.resolve(r).then(() => {
        if (buf) { start(); return true; }
        return new Promise((res) => listeners.push(res)); // still loading: starts as soon as it is ready
      });
    },
    pause() {
      want = false;
      if (el) el.pause();
      if (ctx && ctx.state === 'running') ctx.suspend();
      if (keepAlive) keepAlive.pause();
    },
    resume() {
      want = true;
      if (failed || !ctx) return fallback().play().then(() => true);
      if (keepAlive) keepAlive.play().catch(() => {});
      return Promise.resolve(ctx.resume()).then(() => { if (buf && !node) start(); return true; });
    },
    destroy() {
      want = false;
      try { if (node) node.stop(); } catch (e) { /* ignore */ }
      if (el) el.pause();
      if (keepAlive) keepAlive.pause();
      if (ctx && ctx.close) ctx.close().catch(() => {});
    },
    get unavailable() { return failed && !el; },
  };
}
