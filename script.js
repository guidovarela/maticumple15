/* ==========================================================================
   LÓGICA JAVASCRIPT - INVITACIÓN DIGITAL 15 AÑOS "MATILDA"
   ========================================================================== */

/* ==========================================================================
   1. CONFIGURACIÓN DE BASE DE DATOS (FIREBASE FIRESTORE & GOOGLE APPS SCRIPT)
   ==========================================================================
   Para conectar esta aplicación a tu propia base de datos en tiempo real:

   OPCIÓN A: FIREBASE FIRESTORE
   Descomenta las siguientes líneas e ingresa las credenciales de tu proyecto en Firebase Console:

   import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
   import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

   const firebaseConfig = {
     apiKey: "TU_API_KEY_AQUI",
     authDomain: "tu-proyecto.firebaseapp.com",
     projectId: "tu-proyecto-id",
     storageBucket: "tu-proyecto.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123def456"
   };

   const firebaseApp = initializeApp(firebaseConfig);
   const firestoreDb = getFirestore(firebaseApp);

   OPCIÓN B: GOOGLE SHEETS VIA GOOGLE APPS SCRIPT (WEBHOOK)
   Si prefieres recibir las respuestas directamente en un Google Sheets:
   const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/TU_SCRIPT_ID/exec";
   ========================================================================== */

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzjLHd03TC3lv2V3Uh131hiWH7wL51tmAWIxubqmWBXRAh1Q0xRxO80vRh2dVmMospOJg/exec"; // Pegar URL de Apps Script si se utiliza

// --------------------------------------------------------------------------
// 2. OBJETIVO DE LA FECHA DE LA FIESTA
// --------------------------------------------------------------------------
// Fecha del evento: 3 de Octubre de 2026, 21:00 hs (Mes 9 en JS = Octubre)
const TARGET_DATE = new Date(2026, 9, 3, 21, 0, 0);

// --------------------------------------------------------------------------
// 3. INICIALIZACIÓN AL CARGAR EL DOM
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initStarCanvas();
  initCountdown();
  initCalendarButton();
  initCalendarButtonIphone();
  initRSVPForm();
  initSongSuggestions();
  initModals();
  initClipboardButtons();
  initAmbientMusic();
});

/* ==========================================================================
   4. CANVAS DE ESTRELLAS ANIMADAS
   ========================================================================== */
function initStarCanvas() {
  const canvas = document.getElementById("star-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let stars = [];
  const starCount = window.innerWidth < 768 ? 70 : 130;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.6 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.015 + 0.005,
        direction: Math.random() > 0.5 ? 1 : -1
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
      star.alpha += star.speed * star.direction;
      if (star.alpha >= 1 || star.alpha <= 0.1) {
        star.direction *= -1;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(235, 235, 235, ${star.alpha.toFixed(2)})`;
      ctx.fill();
    });

    requestAnimationFrame(drawStars);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    createStars();
  });

  resizeCanvas();
  createStars();
  drawStars();
}

/* ==========================================================================
   5. CONTADOR EN VIVO (COUNTDOWN)
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const statusEl = document.getElementById("countdown-status");

  function updateTimer() {
    const now = new Date().getTime();
    const distance = TARGET_DATE.getTime() - now;

    if (distance < 0) {
      if (daysEl) daysEl.textContent = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minutesEl) minutesEl.textContent = "00";
      if (secondsEl) secondsEl.textContent = "00";
      if (statusEl) statusEl.textContent = "¡El gran día ha llegado! 🌕✨";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   6. AGENDAR EN GOOGLE CALENDAR
   ========================================================================== */
function initCalendarButton() {
  const btnCalendar = document.getElementById("btn-calendar");
  if (!btnCalendar) return;

  btnCalendar.addEventListener("click", () => {
    // Formato UTC: AAAA-MM-DD-THHMMSSZ
    // Octubre 3, 2026, 21:00 hs Argentina (UTC-3) -> 2026-10-04 00:00:00 UTC
    // Finalización: Octubre 4, 2026, 05:00 hs Argentina -> 2026-10-04 08:00:00 UTC
    const title = encodeURIComponent("Los 15 de Matilda");
    const details = encodeURIComponent("¡Celebremos juntos!");
    const location = encodeURIComponent("Jano`s San Telmo II- Moreno 550 , CABA, Argentina");
    const dates = "20261004T000000Z/20261004T080000Z";

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`;

    window.open(calendarUrl, "_blank");
    showToast("🗓️ Redirigiendo a Google Calendar...");
  });
}

/* ==========================================================================
   6. AGENDAR EN CALENDAR Iphone
   ========================================================================== */
function initCalendarButtonIphone() {
  const btnCalendarIphone = document.getElementById("btn-calendar-iphone");
  if (!btnCalendarIphone) return;  
  
  btnCalendarIphone.addEventListener("click", () => {
    const title = encodeURIComponent("Los 15 de Matilda");
    const details = encodeURIComponent("¡Celebremos juntos!");
    const location = encodeURIComponent("Jano`s San Telmo II- Moreno 550 , CABA, Argentina");
    const startDate = "20261003T210000"; // 3 de Octubre de 2026, 21:00 hs
    const endDate = "20261004T050000"; // 4 de Octubre de 2026, 05:00 hs

    const calendarUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ASUMMARY:${title}%0ADESCRIPTION:${details}%0ALOCATION:${location}%0ADTSTART:${startDate}%0ADTEND:${endDate}%0AEND:VEVENT%0AEND:VCALENDAR`;

    window.open(calendarUrl, "_blank");
    showToast("�🗓️ Redirigiendo a Calendar iPhone...");
  });

}


/* ==========================================================================
   7. MANEJO DEL FORMULARIO RSVP (CONFIRMACIÓN DE ASISTENCIA)
   ========================================================================== */
function initRSVPForm() {
  const form = document.getElementById("rsvp-form");
  const successBox = document.getElementById("rsvp-success-msg");
  const successText = document.getElementById("rsvp-success-text");
  const editBtn = document.getElementById("rsvp-edit-btn");
  const submitBtn = document.getElementById("rsvp-submit-btn");

  if (!form) return;

  // Verificar si ya envió una respuesta en LocalStorage
  const savedRsvp = localStorage.getItem("matilda15_rsvp_data");
  if (savedRsvp) {
    try {
      const data = JSON.parse(savedRsvp);
      showRSVPSuccessState(data);
    } catch (e) {
      console.error(e);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const fecha = new Date();
    const rsvpData = {
      nombre: formData.get("nombre") ? formData.get("nombre").trim() : "",
      asiste: formData.get("asiste"),
      restriccion: formData.get("restriccion"),
      mensaje: formData.get("mensaje") ? formData.get("mensaje").trim() : "",
      fecha: fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear()+" "+fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds()
    };

    // console.log("RSVP Data:", rsvpData);

    if (!rsvpData.nombre) {
      showToast("⚠️ Por favor, ingresa tu nombre y apellido.", "error");
      return;
    }

    // Animación de envío en el botón
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Enviando...</span> ✨`;
    }

    try {
      // Guardado local de respaldo
      localStorage.setItem("matilda15_rsvp_data", JSON.stringify(rsvpData));

      // Si se configuró Google Apps Script Webhook
      if (GOOGLE_SCRIPT_URL) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rsvpData)
        });
      }

      /* SI SE UTILIZA FIREBASE FIRESTORE:
      if (typeof addDoc !== "undefined" && typeof collection !== "undefined" && firestoreDb) {
        await addDoc(collection(firestoreDb, "rsvps"), rsvpData);
      }
      */

      showToast("✨ ¡Confirmación guardada con éxito!");
      showRSVPSuccessState(rsvpData);
    } catch (err) {
      console.error("Error al guardar RSVP:", err);
      showToast("✨ ¡Confirmación guardada!");
      showRSVPSuccessState(rsvpData);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span class="btn-text">Confirmar Mi Asistencia</span> <span class="btn-icon">✨</span>`;
      }
    }
  });

  if (editBtn) {
    editBtn.addEventListener("click", () => {
      form.classList.remove("hidden");
      successBox.classList.add("hidden");
    });
  }

  function showRSVPSuccessState(data) {
    if (form) form.classList.add("hidden");
    if (successBox) successBox.classList.remove("hidden");

    if (successText) {
      const isAttending = data.asiste === "si";
      if (isAttending) {
        successText.innerHTML = `¡Excelente, <strong>${data.nombre}</strong>! <br> Gracias por confirmar. <br> ¡Nos vemos el 3 de Octubre!`;
      } else {
        successText.innerHTML = `Gracias por avisarnos, ${data.nombre}. <br> Lamento mucho que no puedas asistir`;
      }
    }
  }
}

/* ==========================================================================
   8. FORMULARIO "SUGERIR CANCIÓN" Y LISTA INTERACTIVA
   ========================================================================== */
const INITIAL_SONGS = [
  { id: 1, title: "A Sky Full of Stars", artist: "Coldplay", user: "Valen", votes: 8 },
  { id: 2, title: "Night Changes", artist: "One Direction", user: "Sofia", votes: 12 },
  { id: 3, title: "Golden", artist: "Harry Styles", user: "Matilda", votes: 15 },
  { id: 4, title: "Dance The Night", artist: "Dua Lipa", user: "Lucía", votes: 6 }
];

function initSongSuggestions() {
  const songForm = document.getElementById("song-form");
  const container = document.getElementById("song-list-container");

  if (!container) return;

  // Cargar canciones desde localStorage o usar iniciales
  let songs = [];
  const stored = localStorage.getItem("matilda15_songs_list");
  if (stored) {
    try {
      songs = JSON.parse(stored);
    } catch (e) {
      songs = INITIAL_SONGS;
    }
  } else {
    songs = INITIAL_SONGS;
    localStorage.setItem("matilda15_songs_list", JSON.stringify(songs));
  }

  function renderSongs() {
    container.innerHTML = "";
    // Ordenar por votos de mayor a menor
    songs.sort((a, b) => b.votes - a.votes);

    songs.forEach((song) => {
      const card = document.createElement("div");
      card.className = "song-item";
      card.innerHTML = `
        <div class="song-details">
          <span class="song-title-text">${escapeHtml(song.title)}</span>
          <span class="song-artist-text">${escapeHtml(song.artist)} ${song.user ? `(por ${escapeHtml(song.user)})` : ''}</span>
        </div>
        <button class="song-votes-btn" data-id="${song.id}">
          ❤️ <span>${song.votes}</span>
        </button>
      `;

      const voteBtn = card.querySelector(".song-votes-btn");
      if (voteBtn) {
        voteBtn.addEventListener("click", () => {
          song.votes += 1;
          localStorage.setItem("matilda15_songs_list", JSON.stringify(songs));
          renderSongs();
          showToast(`🎵 ¡Votaste por "${song.title}"!`);
        });
      }

      container.appendChild(card);
    });
  }

  if (songForm) {
    songForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const titleInput = document.getElementById("song-title");
      const artistInput = document.getElementById("song-artist");
      const userInput = document.getElementById("song-user");

      if (!titleInput || !artistInput) return;

      const title = titleInput.value.trim();
      const artist = artistInput.value.trim();
      const user = userInput ? userInput.value.trim() : "";

      if (!title || !artist) {
        showToast("⚠️ Ingresa el nombre de la canción y el artista.", "error");
        return;
      }

      const newSong = {
        id: Date.now(),
        title,
        artist,
        user,
        votes: 1
      };

      songs.push(newSong);
      localStorage.setItem("matilda15_songs_list", JSON.stringify(songs));
      renderSongs();

      titleInput.value = "";
      artistInput.value = "";
      if (userInput) userInput.value = "";

      showToast("🎶 ¡Canción agregada a la lista!");
    });
  }

  renderSongs();
}

/* ==========================================================================
   9. GESTIÓN DE MODALES (DRESS CODE Y REGALOS)
   ========================================================================== */
function initModals() {
  // Modal Dress Code
  setupModal("btn-dresscode-modal", "dresscode-modal", "close-dresscode-modal");
  
  // Modal Regalos
  setupModal("btn-gift-modal", "gift-modal", "close-gift-modal");
}

function setupModal(triggerId, modalId, closeId) {
  const trigger = document.getElementById(triggerId);
  const modal = document.getElementById(modalId);
  const closeBtn = document.getElementById(closeId);

  if (!trigger || !modal) return;

  trigger.addEventListener("click", () => {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Previene scroll de fondo
  });

  const closeModal = () => {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  // Cerrar al hacer clic en el fondo oscuro
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Cerrar con tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
}

/* ==========================================================================
   10. FUNCIONALIDAD PORTAPAPELES (COPIAR ALIAS Y CBU)
   ========================================================================== */
function initClipboardButtons() {
  const aliasVal = "MATILDA.15.MOON";
  const cbuVal = "0000003100084739201948";

  const btnAlias = document.getElementById("btn-copy-alias");
  const btnModalAlias = document.getElementById("btn-modal-copy-alias");
  const btnCbu = document.getElementById("btn-copy-cbu");

  if (btnAlias) {
    btnAlias.addEventListener("click", () => copyToClipboard(aliasVal, "Alias"));
  }

  if (btnModalAlias) {
    btnModalAlias.addEventListener("click", () => copyToClipboard(aliasVal, "Alias"));
  }

  if (btnCbu) {
    btnCbu.addEventListener("click", () => copyToClipboard(cbuVal, "CBU"));
  }
}

function copyToClipboard(text, label) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`📋 ¡${label} (${text}) copiado al portapapeles!`);
    }).catch(err => {
      fallbackCopy(text, label);
    });
  } else {
    fallbackCopy(text, label);
  }
}

function fallbackCopy(text, label) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand("copy");
    showToast(`📋 ¡${label} copiado al portapapeles!`);
  } catch (err) {
    showToast(`⚠️ Copia manual: ${text}`);
  }
  document.body.removeChild(textArea);
}

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

/* ==========================================================================
   12. NOTIFICACIÓN TOAST REUTILIZABLE
   ========================================================================== */
function showToast(message, type = "success") {
  const toast = document.getElementById("toast-notification");
  const msgEl = document.getElementById("toast-message");

  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3500);
}

/* Helper para sanitizar texto evadiendo XSS */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
