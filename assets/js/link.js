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
   GENERATE LINK
============================ */

export function generateLink() {
    if (DEBUG_PERF) performance.mark("generate-start");

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

    if (notice) notice.textContent = "";

    if (DEBUG_PERF) {
        performance.mark("generate-end");
        performance.measure("generate-link", "generate-start", "generate-end");
        const m = performance.getEntriesByName("generate-link")[0];

        const logCard = document.getElementById("shorten-log");
        const logContent = document.getElementById("shorten-log-content");

        logCard.classList.remove("hidden");
        logCard.classList.add("info");
        logContent.textContent = `⚡ Производительность\n-------------------------\n⏱ Генерация ссылки: ${Math.round(m.duration)} ms`;
    }
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

    if (DEBUG_KV && kvTestBtn) {
        kvTestBtn.classList.remove("hidden");
        kvTestBtn.onclick = async () => {
            logCard.classList.remove("hidden");
            logCard.classList.add("info");
            logContent.textContent = "⏳ Тестирую KV...";

            const testUrl = "https://example.com/";
            const result = await shortenUrl(testUrl);

            logContent.textContent =
                `🧪 KV‑тест\n-------------------------\n` +
                `⏱ Latency: ${result.latency} ms\n` +
                `📡 Статус: ${result.status}\n\n` +
                `📦 Ответ:\n${result.raw}`;
        };
    }

    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            const url = document.getElementById("generated-url").value;
            if (!url) return;
            navigator.clipboard.writeText(url);
        });
    }

    if (testBtn) {
        testBtn.addEventListener("click", () => {
            const url = document.getElementById("generated-url").value;
            if (!url) return;
            window.open(url, "_blank");
        });
    }

    if (shortenBtn) {
        shortenBtn.addEventListener("click", async () => {
            const input = document.getElementById("generated-url");
            const notice = document.getElementById("shorten-notice");
            const original = input.dataset.original || input.value;

            if (!original) return;

            if (notice) notice.textContent = "";

            if (!DEBUG && !DEBUG2) {
                logCard.classList.add("hidden");
            } else {
                logCard.classList.add("hidden");
                logCard.classList.remove("success", "error", "info");
                logContent.textContent = "";
            }

            shortenBtn.dataset.loading = "true";
            const previous = input.value;
            input.value = "Сокращаю...";

            const result = await shortenUrl(original);
            input.value = result.url;
            input.dataset.last = previous;

            if (!result.ok && notice) {
                notice.textContent = "Не удалось сократить ссылку, показываю оригинал.";
            }

            if (DEBUG2) {
                logCard.classList.remove("hidden");
                logCard.classList.add("info");

                let headers = "";
                if (result.headers) {
                    result.headers.forEach((v, k) => {
                        headers += `${k}: ${v}\n`;
                    });
                }

                logContent.textContent =
                    `🔍 Расширенный лог\n-------------------------\n` +
                    `⏱ Latency: ${result.latency} ms\n` +
                    `📡 Статус: ${result.status}\n\n` +
                    `📨 Заголовки:\n${headers}\n` +
                    `📦 Ответ:\n${result.raw}`;
            }

            if (DEBUG && !DEBUG2) {
                logCard.classList.remove("hidden");
                logCard.classList.add(result.ok ? "success" : "error");
                logContent.textContent = (result.ok ? "✅ Успех\n" : "❌ Ошибка\n") + result.raw;
            }

            shortenBtn.dataset.loading = "false";

            if (DEBUG || DEBUG2) {
                hideBtn.onclick = () => {
                    logCard.classList.add("hidden");
                };
            }
        });
    }
}