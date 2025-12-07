import { state, loadState } from "./store.js";
import { renderWallets, initAddWalletButton } from "./wallets.js";
import { generateLink, initLinkButtons } from "./link.js";
import { checkForViewMode, applyThemeFromURL } from "./viewmode.js";

function initMainFields() {
    const titleInput = document.getElementById("title");
    const descInput = document.getElementById("description");
    const themeSelect = document.getElementById("theme-select");

    state.title = "Мои реквизиты";
    state.description = "Выберите удобный способ для перевода";

    titleInput.addEventListener("input", e => {
        state.title = e.target.value;
    });

    descInput.addEventListener("input", e => {
        state.description = e.target.value;
    });

    themeSelect.addEventListener("change", e => {
        const theme = e.target.value;
        state.theme = theme;

        document.body.classList.forEach(c => {
            if (c.startsWith("theme-")) document.body.classList.remove(c);
        });

        document.body.classList.add(`theme-${theme}`);
    });
}

function initButtons() {
    const generateBtn = document.getElementById("generate-btn");
    const logo = document.querySelector(".logo");

    generateBtn.addEventListener("click", () => {
        // Генерация ссылки
        generateLink();

        // Акцент на блоке результата
        const result = document.getElementById("result");

        // Показать блок (если скрыт)
        result.style.display = "block";

        // Плавное появление
        result.classList.add("show");

        // Прокрутка к блоку
        result.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        // Flash-подсветка
        result.classList.remove("flash");
        void result.offsetWidth; // перезапуск анимации
        result.classList.add("flash");
    });

    logo.addEventListener("click", () => {
        location.href = location.origin + location.pathname;
    });

    initAddWalletButton();
    initLinkButtons();
}

function init() {
    applyThemeFromURL();
    checkForViewMode();

    loadState(); // ✅ важно

    initMainFields();
    initButtons();
    renderWallets();
}

init();