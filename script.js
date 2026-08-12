import { TARGET_DATE } from "./modules/setTargetDate.js";
import { initStarCanvas } from "./modules/starCanvas.js";
import { initCountdown } from "./modules/countdown.js";
import { initCalendarButton,initCalendarButtonIphone } from "./modules/initCalendars.js";
import { initSongSuggestions } from "./modules/songsuggestions.js";
import { GOOGLE_SCRIPT_URL} from "./modules/scriptKeyGoogle.js";
import { showToast } from "./modules/showToast.js";
import { initAmbientMusic } from "./modules/ambientMusic.js";
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


// --------------------------------------------------------------------------
// 2. OBJETIVO DE LA FECHA DE LA FIESTA
// --------------------------------------------------------------------------
// Fecha del evento: 3 de Octubre de 2026, 21:00 hs (Mes 9 en JS = Octubre)
//const TARGET_DATE = new Date(2026, 9, 3, 21, 0, 0);

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
   4. CANVAS DE ESTRELLAS ANIMADAS -  (modules/starCanvas.js)
   ========================================================================== */

/* ==========================================================================
   5. CONTADOR EN VIVO (COUNTDOWN) - (modules/countdown.js)
   ========================================================================== */

/* ==========================================================================
   6. AGENDAR EN GOOGLE CALENDAR - (modules/initCalendars.js)
   ========================================================================== */

/* ==========================================================================
   6. AGENDAR EN CALENDAR Iphone - (modules/initCalendars.js)
   ========================================================================== */

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
      //localStorage.setItem("matilda15_rsvp_data", JSON.stringify(rsvpData));

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
   8. FORMULARIO "SUGERIR CANCIÓN" Y LISTA INTERACTIVA - (modules/songSuggestions.js)
   ========================================================================== */

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
  const aliasVal = "var.mati.mp";
  const cbuVal = "0000003100080794378240";

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
