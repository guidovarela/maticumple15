/* ==========================================================================
   10. FUNCIONALIDAD PORTAPAPELES (COPIAR ALIAS Y CBU)
   ========================================================================== */

import { showToast } from "./toastNotification.js";
import { initModals } from "./initModals.js";

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

export { initClipboardButtons };