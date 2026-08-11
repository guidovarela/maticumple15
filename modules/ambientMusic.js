/* ==========================================================================
   11. MÚSICA AMBIENTAL CON SINTETIZADOR BROWSER WEB AUDIO API
   ========================================================================== */
function initAmbientMusic() {
  const btn = document.getElementById("ambient-music-btn");
  if (!btn) return;

  let audioCtx = null;
  let isPlaying = false;
  let intervalId = null;

  // Notas celestiales relajantes (Arpegio en A menor / C mayor)
  const notes = [120, 150, 180, 210, 240, 270, 300]; // Frecuencias en Hz

  function playAmbientNote() {
    if (!isPlaying || !audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      const freq = notes[Math.floor(Math.random() * notes.length)];
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 2.6);
    } catch (e) {
      console.error(e);
    }
  }

  btn.addEventListener("click", () => {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }

    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    isPlaying = !isPlaying;

    if (isPlaying) {
      btn.classList.add("playing");
      btn.innerHTML = `<span class="music-icon">🎶</span> <span class="music-text">Música ON</span>`;
      playAmbientNote();
      intervalId = setInterval(playAmbientNote, 800);
      showToast("🔈 Música activada");
    } else {
      btn.classList.remove("playing");
      btn.innerHTML = `<span class="music-icon">🎵</span> <span class="music-text">Música</span>`;
      if (intervalId) clearInterval(intervalId);
      showToast("🔇 Música pausada");
    }
  });
}

export { initAmbientMusic };