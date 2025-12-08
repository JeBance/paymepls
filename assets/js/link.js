/* ============================================================
   ГЕНЕРАЦИЯ ССЫЛКИ + СОКРАЩЕНИЕ
============================================================ */

import { state } from "./store.js";

/* ============================
   SHORTENER API
============================ */

async function shortenUrl(url) {
    try {
        const res = await fetch("https://ulvis.net/api/v1/shorten", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });

        const data = await res.json();

        if (data.shortUrl) {
            return data.shortUrl;
        }

        return url; // fallback
    } catch {
        return url; // fallback
    }
}

/* ============================
   ГЕНЕРАЦИЯ ССЫЛКИ
============================ */

export async function generateLink() {
    const data = {
        title: state.title,
        description: state.description,
        wallets: state.wallets
    };

    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    const longUrl = `${location.origin}${location.pathname}?data=${encoded}&theme=${state.theme}`;

    const input = document.getElementById("generated-url");
    const result = document.getElementById("result");

    // Показываем длинную ссылку сразу
    input.value = longUrl;
    result.style.display = "block";

    // Автоматическое сокращение
    input.dataset.original = longUrl; // сохраняем оригинал
    input.value = "Сокращаю...";

    const short = await shortenUrl(longUrl);
    input.value = short;
}

/* ============================
   КНОПКИ
============================ */

export function initLinkButtons() {
    const copyBtn = document.getElementById("copy-btn");
    const testBtn = document.getElementById("test-link-btn");
    const shortenBtn = document.getElementById("shorten-btn");

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

    if (shortenBtn) {
        shortenBtn.addEventListener("click", async () => {
            const input = document.getElementById("generated-url");
            const original = input.dataset.original || input.value;

            input.value = "Сокращаю...";

            const short = await shortenUrl(original);
            input.value = short;
        });
    }
}