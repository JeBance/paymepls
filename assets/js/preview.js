/* ============================================================
   ПРЕДПРОСМОТР
============================================================ */

import { state } from "./store.js";
import { escapeHTML, getQRSize } from "./utils.js";

/**
 * Рендерит предпросмотр кошельков
 */
export function renderPreview() {
    const preview = document.getElementById("preview");
    const container = document.getElementById("preview-container");

    if (state.wallets.length === 0) {
        preview.style.display = "none";
        return;
    }

    preview.style.display = "block";
    container.innerHTML = "";

    state.wallets.forEach(wallet => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${escapeHTML(wallet.name || "Без названия")}</h3>
            <p>${escapeHTML(wallet.value || "—")}</p>
            <div class="qr-box" id="qr-preview-${wallet.id}"></div>
        `;

        container.appendChild(card);

        new QRCode(document.getElementById(`qr-preview-${wallet.id}`), {
            text: wallet.value || "",
            width: getQRSize(),
            height: getQRSize()
        });
    });
}