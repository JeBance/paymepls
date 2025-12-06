/* ============================================================
   VIEW MODE — отображение страницы реквизитов
============================================================ */

import { escapeHTML, getQRSize } from "./utils.js";

/**
 * Рендерит страницу реквизитов (view‑mode)
 */
export function renderViewMode(data) {
    // Скрываем конструктор
    document.getElementById("constructor").style.display = "none";
    document.getElementById("intro").style.display = "none";
    document.getElementById("preview").style.display = "none";
    document.getElementById("result").style.display = "none";

    const view = document.getElementById("view-mode");
    view.style.display = "block";

    const container = document.getElementById("payment-page-container");
    container.innerHTML = "";

    // Заголовок
    const title = document.createElement("h1");
    title.textContent = data.title || "Реквизиты";
    container.appendChild(title);

    // Описание
    if (data.description) {
        const desc = document.createElement("p");
        desc.textContent = data.description;
        desc.style.marginBottom = "40px";
        container.appendChild(desc);
    }

    // Сетка кошельков
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

        // QR‑код
        new QRCode(document.getElementById(`qr-view-${wallet.id}`), {
            text: wallet.value,
            width: getQRSize(),
            height: getQRSize()
        });
    });

    // Копирование реквизитов
    document.querySelectorAll("[data-copy]").forEach(btn => {
        btn.addEventListener("click", () => {
            navigator.clipboard.writeText(btn.dataset.copy);
        });
    });
}

/* ============================================================
   ПАРСИНГ ССЫЛКИ
============================================================ */

/**
 * Проверяет URL и включает view‑mode, если есть параметр data
 */
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

/* ============================================================
   ПРИМЕНЕНИЕ ТЕМЫ
============================================================ */

/**
 * Применяет тему из параметра URL
 */
export function applyThemeFromURL() {
    const params = new URLSearchParams(location.search);
    const theme = params.get("theme");

    if (theme) {
        // Удаляем старые темы
        document.body.classList.forEach(c => {
            if (c.startsWith("theme-")) document.body.classList.remove(c);
        });

        // Добавляем новую
        document.body.classList.add(`theme-${theme}`);

        // Синхронизируем селектор, если он есть
        const select = document.getElementById("theme-select");
        if (select) select.value = theme;
    }
}