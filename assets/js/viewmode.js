/* ============================================================
   VIEW MODE — отображение страницы реквизитов
============================================================ */

import { escapeHTML, getQRSize } from "./utils.js";

export function renderViewMode(data) {
    document.getElementById("constructor").style.display = "none";
    document.getElementById("intro").style.display = "none";
    document.getElementById("preview").style.display = "none";
    document.getElementById("result").style.display = "none";

    const view = document.getElementById("view-mode");
    view.style.display = "block";

    const container = document.getElementById("payment-page-container");
    container.innerHTML = "";

    const title = document.createElement("h1");
    title.textContent = data.title || "Реквизиты";
    container.appendChild(title);

    if (data.description) {
        const desc = document.createElement("p");
        desc.textContent = data.description;
        desc.style.marginBottom = "40px";
        container.appendChild(desc);
    }

    const grid = document.createElement("div");
    grid.className = "grid grid-2";
    container.appendChild(grid);

    data.wallets.forEach(wallet => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${escapeHTML(wallet.name)}</h3>
            <p>${escapeHTML(wallet.value)}</p>
            <div class="qr-box" id="qr-view-${wallet.id}"></div>

            <button class="btn" style="margin-top:20px;" data-copy="${escapeHTML(wallet.value)}">
                <i class="fas fa-copy"></i> Скопировать
            </button>
        `;

        grid.appendChild(card);

        new QRCode(document.getElementById(`qr-view-${wallet.id}`), {
            text: wallet.value,
            width: getQRSize(),
            height: getQRSize()
        });
    });

    document.querySelectorAll("[data-copy]").forEach(btn => {
        btn.addEventListener("click", () => {
            navigator.clipboard.writeText(btn.dataset.copy);
        });
    });
}

export function checkForViewMode() {
    const params = new URLSearchParams(location.search);

    if (params.has("data")) {
        try {
            const decoded = JSON.parse(decodeURIComponent(atob(params.get("data"))));
            renderViewMode(decoded);
        } catch (e) {
            console.error("Ошибка парсинга данных");
        }
    }
}

export function applyThemeFromURL() {
    const params = new URLSearchParams(location.search);
    const theme = params.get("theme");

    if (theme) {
        document.body.classList.forEach(c => {
            if (c.startsWith("theme-")) document.body.classList.remove(c);
        });

        document.body.classList.add(`theme-${theme}`);

        const select = document.getElementById("theme-select");
        if (select) select.value = theme;
    }
}