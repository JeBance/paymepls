/* ============================================================
   ГЕНЕРАЦИЯ ССЫЛКИ
============================================================ */

import { state } from "./store.js";

/**
 * Генерирует ссылку на страницу реквизитов
 */
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

/**
 * Инициализация кнопок копирования и открытия ссылки
 */
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