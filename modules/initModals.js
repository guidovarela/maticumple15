/* ==========================================================================
   9. GESTIÓN DE MODALES (DRESS CODE Y REGALOS)
   ========================================================================== */
import {showToast} from "./showToast.js"; // Asegúrate de importar la función showToast si la necesitas

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

export { initModals, setupModal };