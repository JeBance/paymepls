/* ============================================================
   LINK GENERATION + SHORTENER
============================================================ */

import { state } from "./store.js";

/* ============================
   DEBUG MODE
============================ */

const DEBUG = new URL(location.href).searchParams.get("debug") === "1";

/* ============================
   SHORTENER API (Cloudflare Worker)
============================ */

async function shortenUrl(url) {
    try {
        const res = await fetch("https://links.paymepls.workers.dev/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ target: url })
        });

        const text = await res.text();

        let data = {};
        try {
            data = JSON.parse(text);
        } catch {
            data = { parseError: true, raw: text };
        }

        return { ok: !!data.short, url: data.short || url, raw: text };
    } catch (e) {
        return { ok: false, url, raw: "Request error: " + e.toString() };
    }
}

/* ============================
   GENERATE LINK
============================ */

export function generateLink() {
    const data = {
        title: state.title,
        description: state.description,
        wallets: state.wallets
    };

    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    const url = `${location.origin}${location.pathname}?data=${encoded}&theme=${state.theme}`;

    const input = document.getElementById("generated-url");
    const notice = document.getElementById("shorten-notice");

    input.value = url;
    input.dataset.original = url;

    if (notice) {
        notice.textContent = "";
    }
}

/* ============================
   BUTTONS
============================ */

export function initLinkButtons() {
    const copyBtn = document.getElementById("copy-btn");
    const testBtn = document.getElementById("test-link-btn");
    const shortenBtn = document.getElementById("shorten-btn");

    const logCard = document.getElementById("shorten-log");
    const logContent = document.getElementById("shorten-log-content");
    const hideBtn = document.getElementById("shorten-log-hide");

    /* COPY */
    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            const url = document.getElementById("generated-url").value;
            if (!url) return;
            navigator.clipboard.writeText(url);
        });
    }

    /* OPEN */
    if (testBtn) {
        testBtn.addEventListener("click", () => {
            const url = document.getElementById("generated-url").value;
            if (!url) return;
            window.open(url, "_blank");
        });
    }

    /* SHORTEN */
    if (shortenBtn) {
        shortenBtn.addEventListener("click", async () => {
            const input = document.getElementById("generated-url");
            const notice = document.getElementById("shorten-notice");
            const original = input.dataset.original || input.value;

            if (!original) return;

            if (notice) notice.textContent = "";

            // Скрываем лог, если debug выключен
            if (!DEBUG) {
                logCard.classList.add("hidden");
            } else {
                logCard.classList.add("hidden");
                logCard.classList.remove("success", "error", "info");
                logContent.textContent = "";
            }

            // Честный индикатор загрузки
            shortenBtn.dataset.loading = "true";

            const previous = input.value;
            input.value = "Сокращаю...";

            const result = await shortenUrl(original);

            input.value = result.url;

            if (!result.ok && notice) {
                notice.textContent = "Не удалось сократить ссылку, показываю оригинал.";
            }

            input.dataset.last = previous;

            // Показываем лог только в debug
            if (DEBUG) {
                logCard.classList.remove("hidden");

                if (result.ok) {
                    logCard.classList.add("success");
                    logContent.textContent = "✅ Успех\n" + result.raw;
                } else {
                    logCard.classList.add("error");
                    logContent.textContent = "❌ Ошибка\n" + result.raw;
                }
            }

            // Выключаем индикатор
            shortenBtn.dataset.loading = "false";

            // Кнопка «Скрыть»
            if (DEBUG) {
                hideBtn.onclick = () => {
                    logCard.classList.add("hidden");
                };
            }
        });
    }
}