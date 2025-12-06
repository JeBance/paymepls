/* ============================================================
   VIEW MODE — отображение страницы реквизитов (стабильная версия)
============================================================ */

import { escapeHTML, getQRSize } from "./utils.js";

export function renderViewMode(data) {
    // скрываем конструктор и результат
    const constructor = document.getElementById("constructor");
    const result = document.getElementById("result");

    if (constructor) constructor.style.display = "none";
    if (result) result.style.display = "none";

    // показываем view-mode
    const view = document.getElementById("view-mode");
    view.style.display = "block";

    const container = document.getElementById("payment-page-container");
    container.innerHTML = "";

    /* ============================
       Заголовок
    ============================ */
    const title = document.createElement("h1");
    title.textContent = data.title || "Реквизиты";
    title.style.textAlign = "center";
    title.style.marginBottom = "20px";
    container.appendChild(title);

    /* ============================
       Описание
    ============================ */
    if (data.description) {
        const desc = document.createElement("p");
        desc.textContent = data.description;
        desc.style.textAlign = "center";
        desc.style.margin = "0 auto 36px auto";
        desc.style.maxWidth = "700px";
        container.appendChild(desc);
    }

    /* ============================
       Сетка кошельков
    ============================ */
    const grid = document.createElement("div");
    grid.className = "grid grid-2";
    grid.style.marginTop = "20px";
    grid.style.maxWidth = "1000px";
    grid.style.marginLeft = "auto";
    grid.style.marginRight = "auto";
    container.appendChild(grid);

    /* ============================
       Карточки
    ============================ */
    data.wallets.forEach(wallet => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.padding = "32px";

        card.innerHTML = `
            <h3 style="margin-bottom:14px;">${escapeHTML(wallet.name)}</h3>
            <p style="margin-bottom:22px; word-break:break-word;">${escapeHTML(wallet.value)}</p>
            <div class="qr-box" id="qr-view-${wallet.id}" style="margin-bottom:24px;"></div>

            <button class="btn" style="margin-top:8px;" data-copy="${escapeHTML(wallet.value)}">
                <i class="fas fa-copy"></i> Скопировать
            </button>
        `;

        // ВАЖНО: сначала вставляем карточку в DOM
        grid.appendChild(card);

        // Теперь QR-код гарантированно найдётся
        const qrContainer = card.querySelector(`#qr-view-${wallet.id}`);

        const qrSize = Math.max(getQRSize(), 140);

        new QRCode(qrContainer, {
            text: wallet.value,
            width: qrSize,
            height: qrSize
        });
    });

    /* ============================
       Копирование
    ============================ */
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