/* ============================================================
   LINK GENERATION + SHORTENER + AUTO SHORTEN + QR
============================================================ */

import { state } from "./store.js";

/* ============================
   SHORTENER API
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

        return {
            ok: !!data.short,
            url: data.short || url
        };

    } catch (e) {
        return {
            ok: false,
            url
        };
    }
}

/* ============================
   QR CODE
============================ */

function renderQR(url) {
    const box = document.getElementById("qr-short");
    const card = document.getElementById("qr-short-card");

    box.innerHTML = "";
    card.classList.remove("hidden");
    setTimeout(() => card.classList.add("visible"), 10);

    new QRCode(box, {
        text: url,
        width: 180,
        height: 180,
        colorDark: "#000",
        colorLight: "#fff",
        correctLevel: QRCode.CorrectLevel.M
    });

    // ✅ Кликабельное скачивание QR-кода
    setTimeout(() => {
        const canvas = box.querySelector("canvas");
        if (!canvas) return;

        canvas.style.cursor = "pointer";

        canvas.onclick = () => {
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");

            const id = url.split("/").pop().trim();
            link.download = `paymepls-${id}.png`;

            link.click();
        };
    }, 50);
}

/* ============================
   GENERATE LINK + AUTO SHORTEN
============================ */

export function generateLink() {
    const data = {
        title: state.title,
        description: state.description,
        wallets: state.wallets
    };

    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    const longUrl = `${location.origin}${location.pathname}?data=${encoded}&theme=${state.theme}`;

    const input = document.getElementById("generated-url");
    const notice = document.getElementById("shorten-notice");

    input.value = longUrl;
    input.dataset.original = longUrl;

    if (notice) notice.textContent = "";

    autoShorten(longUrl);
}

/* ============================
   AUTO SHORTEN
============================ */

async function autoShorten(url) {
    const shortenBtn = document.getElementById("shorten-btn");
    const input = document.getElementById("generated-url");

    shortenBtn.dataset.loading = "true";
    input.value = "Сокращаю…";

    const result = await shortenUrl(url);

    input.value = result.url;

    if (result.ok) {
        renderQR(result.url);
    }

    shortenBtn.dataset.loading = "false";
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

    /* MANUAL SHORTEN */
    if (shortenBtn) {
        shortenBtn.addEventListener("click", async () => {
            const input = document.getElementById("generated-url");
            const original = input.dataset.original || input.value;

            autoShorten(original);
        });
    }
}