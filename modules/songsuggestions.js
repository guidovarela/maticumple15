/* ==========================================================================
   8. FORMULARIO "SUGERIR CANCIÓN" Y LISTA INTERACTIVA
   ========================================================================== */
import { GOOGLE_SCRIPT_URL } from "./scriptKeyGoogle.js";
import { showToast } from "./showToast.js";

function initSongSuggestions() {

  const songForm = document.getElementById("song-form");
  
  if (songForm) {
    const submitBtn = songForm.querySelector("button[type='submit']");

    songForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const titleInput = document.getElementById("song-title");
      const artistInput = document.getElementById("song-artist");
      const userInput = document.getElementById("song-user");

      if (!titleInput || !artistInput) return;

      const cancion = titleInput.value.trim();
      const artista = artistInput.value.trim();
      const usuario = userInput ? userInput.value.trim() : "";

      if (!cancion || !artista) {
        showToast("⚠️ Por favor, ingresa el nombre de la canción y el artista.", "error");
        return;
      }

      const songData = {
        tipo: "canciones", // Identifica que va a la pestaña Canciones
        cancion,
        artista,
        usuario
      };

      console.log("Datos de la canción a enviar:", songData);

      // Animación de envío en el botón (mismo estilo que initRSVPForm)
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Enviando...</span> ✨`;
      }

      try {
        // Si se configuró Google Apps Script Webhook
        if (GOOGLE_SCRIPT_URL) {
          await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(songData)
          });
        }

        /* SI SE UTILIZA FIREBASE FIRESTORE:
        if (typeof addDoc !== "undefined" && typeof collection !== "undefined" && firestoreDb) {
          await addDoc(collection(firestoreDb, "songs"), songData);
        }
        */

        titleInput.value = "";
        artistInput.value = "";
        if (userInput) userInput.value = "";

        showToast("🎶 ¡Canción agregada con éxito!");
      } catch (err) {
        console.error("Error al sugerir canción:", err);
        showToast("🎶 ¡Canción agregada a la lista!");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span class="btn-icon">🎵</span> Sugerir Canción`;
        }
      }
    });
  }



  // const datosCancion = {
  //   tipo: "canciones", // Identifica que va a la pestaña Canciones
  //   cancion: document.getElementById('song-title').value,
  //   artista: document.getElementById('song-artist').value,
  //   usuario: document.getElementById('song-user').value
  // };

  // console.log("Datos de la canción a enviar:", datosCancion);

  // fetch(GOOGLE_SCRIPT_URL, {
  //   method: "POST",
  //   mode: "no-cors",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(datosCancion)
  // });


}

export { initSongSuggestions };