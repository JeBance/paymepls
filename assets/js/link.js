/* ============================================================
   LINK GENERATION + SHORTENER
============================================================ */

import { state } from "./store.js";

/* ============================
   SHORTENER API (Cloudflare Worker)
============================ */

async function shortenUrl(url) {
    try {
        const res = await fetch("https://paymepls.oleg-prudkov.workers.dev/api/shorten", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ longUrl: url })
        });

        const data = await res.json();

        if (data.shortUrl) {
            return { ok: true, url: data.shortUrl };
        }

        return { ok: false, url };
    } catch (e) {
        console.warn("Shortener error:", e);
        return { ok: false, url };
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

            if (notice) {
                notice.textContent = "";
            }

            const previous = input.value;
            input.value = "Сокращаю...";

            const shortened = await shortenUrl(original);

            input.value = shortened.url;

            if (!shortened.ok && notice) {
                notice.textContent = "Не удалось сократить ссылку, показываю оригинал.";
            }

            input.dataset.last = previous;
        });
    }
}