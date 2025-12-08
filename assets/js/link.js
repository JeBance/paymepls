/* ============================================================
   LINK GENERATION + SHORTENER + DEBUG MODES + AUTO SHORTEN + QR
============================================================ */

import { state } from "./store.js";

/* ============================
   DEBUG MODES
============================ */

const params = new URL(location.href).searchParams;
const DEBUG = params.get("debug") === "1";
const DEBUG2 = params.get("debug") === "2";
const DEBUG_PERF = params.get("debug") === "perf";
const DEBUG_KV = params.get("debug") === "kv";

/* ============================
   DEBUG HEADER
============================ */

function renderDebugHeader() {
    const base = location.origin + location.pathname;

    return (
        "🔧 Debug‑режимы\n" +
        "-------------------------\n" +
        `• Базовый лог: ${base}?debug=1\n` +
        `• Расширенный лог: ${base}?debug=2\n` +
        `• Производительность: ${base}?debug=perf\n` +
        `• Тест KV: ${base}?debug=kv\n\n`
    );
}

/* ============================
   SHORTENER API
============================ */

async function shortenUrl(url) {
    const t0 = performance.now();

    try {
        const res = await fetch("https://links.paymepls.workers.dev/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ target: url })
        });

        const latency = Math.round(performance.now() - t0);
        const text = await res.text();

        let data = {};
        try {
            data = JSON.parse(text);
        } catch {
            data = { parseError: true, raw: text };
        }

        return {
            ok: !!data.short,
            url: data.short || url,
            raw: text,
            latency,
            status: res.status,
            headers: res.headers
        };

    } catch (e) {
        return {
            ok: false,
            url,
            raw: "Request error:\n" + e.toString(),
            latency: -1,
            status: 0,
            headers: null
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

    new QRCode(box, {
        text: url,
        width: 180,
        height: 180,
        colorDark: "#000",
        colorLight: "#fff",
        correctLevel: QRCode.CorrectLevel.M
    });
}

/* ============================
   GENERATE LINK + AUTO SHORTEN
============================ */

export function generateLink() {
    if (DEBUG_PERF) performance.mark("generate-start");

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

    /* ✅ Автоматическое сокращение */
    autoShorten(longUrl);

    if (DEBUG_PERF) {
        performance.mark("generate-end");
        performance.measure("generate-link", "generate-start", "generate-end");
        const m = performance.getEntriesByName("generate-link")[0];

        const logCard = document.getElementById("shorten-log");
        const logContent = document.getElementById("shorten-log-content");

        logCard.classList.remove("hidden");
        logCard.classList.add("info");

        logContent.textContent =
            renderDebugHeader() +
            `⚡ Производительность\n-------------------------\n` +
            `⏱ Генерация ссылки: ${Math.round(m.duration)} ms`;
    }
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
    const kvTestBtn = document.getElementById("kv-test-btn");

    const logCard = document.getElementById("shorten-log");
    const logContent = document.getElementById("shorten-log-content");
    const hideBtn = document.getElementById("shorten-log-hide");

    /* ============================
       KV TEST BUTTON
    ============================ */

    if (DEBUG_KV && kvTestBtn) {
        kvTestBtn.classList.remove("hidden");

        kvTestBtn.onclick = async () => {
            logCard.classList.remove("hidden");
            logCard.classList.add("info");

            logContent.textContent =
                renderDebugHeader() +
                "⏳ Тестирую KV...";

            const testUrl = "https://example.com/";
            const result = await shortenUrl(testUrl);

            logContent.textContent =
                renderDebugHeader() +
                `🧪 KV‑тест\n-------------------------\n` +
                `⏱ Latency: ${result.latency} ms\n` +
                `📡 Статус: ${result.status}\n\n` +
                `📦 Ответ:\n${result.raw}`;
        };
    }

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