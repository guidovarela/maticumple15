/* ==========================================================================
   7. MANEJO DEL FORMULARIO RSVP (CONFIRMACIÓN DE ASISTENCIA)
   ========================================================================== */
   import { showToast } from "./showToast.js";
   
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzjLHd03TC3lv2V3Uh131hiWH7wL51tmAWIxubqmWBXRAh1Q0xRxO80vRh2dVmMospOJg/exec"; // Pegar URL de Apps Script si se utiliza

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

export { initRSVPForm };