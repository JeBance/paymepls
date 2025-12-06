/* ============================================================
   ГЕНЕРАЦИЯ ССЫЛКИ
============================================================ */

import { state } from "./store.js";

export function generateLink() {
    const data = {
        title: state.title,
        description: state.description,
        wallets: state.wallets
    };

    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    const url = `${location.origin}${location.pathname}?data=${encoded}&theme=${state.theme}`;

    const input = document.getElementById("generated-url");
    const result = document.getElementById("result");

    input.value = url;
    result.style.display = "block";
}

export function initLinkButtons() {
    const copyBtn = document.getElementById("copy-btn");
    const testBtn = document.getElementById("test-link-btn");

    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            const url = document.getElementById("generated-url").value;
            navigator.clipboard.writeText(url);
        });
    }

    if (testBtn) {
        testBtn.addEventListener("click", () => {
            const url = document.getElementById("generated-url").value;
            window.open(url, "_blank");
        });
    }
}