/* ==========================================================================
   8. FORMULARIO "SUGERIR CANCIÓN" Y LISTA INTERACTIVA
   ========================================================================== */
function initSongSuggestions() {
  const songForm = document.getElementById("song-form");
  const container = document.getElementById("song-list-container");

  if (!container) return;

  if (songForm) {
    songForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const titleInput = document.getElementById("song-title");
      const artistInput = document.getElementById("song-artist");
      const userInput = document.getElementById("song-user");
      console.log("Agregando canción:", { title, artist, user });

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

export { initSongSuggestions };