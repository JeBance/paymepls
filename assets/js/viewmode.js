/* ============================================================
   VIEW MODE — отображение страницы реквизитов
============================================================ */

import { escapeHTML, getQRSize } from "./utils.js";

export function renderViewMode(data) {
    // скрываем конструктор
    document.getElementById("constructor").style.display = "none";
    document.getElementById("result").style.display = "none";

    const view = document.getElementById("view-mode");
    view.style.display = "block";

    const container = document.getElementById("payment-page-container");
    container.innerHTML = "";

    // Заголовок
    const title = document.createElement("h1");
    title.textContent = data.title || "Реквизиты";
    title.style.textAlign = "center";
    title.style.marginBottom = "24px";
    container.appendChild(title);

    // Описание
    if (data.description) {
        const desc = document.createElement("p");
        desc.textContent = data.description;
        desc.style.textAlign = "center";
        desc.style.marginBottom = "40px";
        container.appendChild(desc);
    }

    // Сетка кошельков
    const grid = document.createElement("div");
    grid.className = "grid grid-2";
    grid.style.marginTop = "20px";
    container.appendChild(grid);

    data.wallets.forEach(wallet => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.padding = "28px";

        card.innerHTML = `
            <h3 style="margin-bottom:12px;">${escapeHTML(wallet.name)}</h3>
            <p style="margin-bottom:20px;">${escapeHTML(wallet.value)}</p>
            <div class="qr-box" id="qr-view-${wallet.id}" style="margin-bottom:20px;"></div>

            <button class="btn" style="margin-top:10px;" data-copy="${escapeHTML(wallet.value)}">
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

    // Копирование
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