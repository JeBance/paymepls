/* ============================================================
   ГЛАВНЫЙ МОДУЛЬ ПРИЛОЖЕНИЯ
============================================================ */

import { state } from "./store.js";
import { renderWallets, initAddWalletButton } from "./wallets.js";
import { renderPreview } from "./preview.js";
import { generateLink, initLinkButtons } from "./link.js";
import { checkForViewMode, applyThemeFromURL } from "./viewmode.js";

/* ============================================================
   ИНИЦИАЛИЗАЦИЯ ПОЛЕЙ
============================================================ */

function initMainFields() {
    const titleInput = document.getElementById("title");
    const descInput = document.getElementById("description");
    const themeSelect = document.getElementById("theme-select");

    if (titleInput) {
        titleInput.addEventListener("input", e => {
            state.title = e.target.value;
        });
    }

    if (descInput) {
        descInput.addEventListener("input", e => {
            state.description = e.target.value;
        });
    }

    if (themeSelect) {
        themeSelect.addEventListener("change", e => {
            const theme = e.target.value;
            state.theme = theme;

            // Удаляем старые темы
            document.body.classList.forEach(c => {
                if (c.startsWith("theme-")) document.body.classList.remove(c);
            });

            // Добавляем новую
            document.body.classList.add(`theme-${theme}`);

            renderPreview();
        });
    }
}

/* ============================================================
   ИНИЦИАЛИЗАЦИЯ КНОПОК
============================================================ */

function initButtons() {
    const generateBtn = document.getElementById("generate-btn");
    const logo = document.querySelector(".logo");

    if (generateBtn) {
        generateBtn.addEventListener("click", generateLink);
    }

    if (logo) {
        logo.addEventListener("click", () => {
            location.href = location.origin + location.pathname;
        });
    }

    initAddWalletButton();
    initLinkButtons();
}

/* ============================================================
   ЗАПУСК ПРИЛОЖЕНИЯ
============================================================ */

function init() {
    applyThemeFromURL();   // применяем тему из URL
    checkForViewMode();    // если есть data — включаем view‑mode

    initMainFields();      // поля title/description/theme
    initButtons();         // кнопки
    renderWallets();       // рендерим пустой список
    renderPreview();       // обновляем предпросмотр
}

init();