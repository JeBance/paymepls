import { state, loadState, saveState } from "./store.js";
import { renderWallets, initAddWalletButton } from "./wallets.js";
import { generateLink, initLinkButtons } from "./link.js";
import { checkForViewMode, applyThemeFromURL } from "./viewmode.js";

function initMainFields() {
    const titleInput = document.getElementById("title");
    const descInput = document.getElementById("description");
    const themeSelect = document.getElementById("theme-select");

    // ✅ Подставляем сохранённые значения
    titleInput.value = state.title || "Мои реквизиты";
    descInput.value = state.description || "Выберите удобный способ для перевода";
    themeSelect.value = state.theme || "classic";

    // ✅ Применяем тему к body
    document.body.classList.forEach(c => {
        if (c.startsWith("theme-")) document.body.classList.remove(c);
    });
    document.body.classList.add(`theme-${state.theme}`);

    // ✅ Обработчики с сохранением состояния
    titleInput.addEventListener("input", e => {
        state.title = e.target.value;
        saveState();
    });

    descInput.addEventListener("input", e => {
        state.description = e.target.value;
        saveState();
    });

    themeSelect.addEventListener("change", e => {
        const theme = e.target.value;
        state.theme = theme;
        saveState();

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
        generateLink();

        const result = document.getElementById("result");
        result.style.display = "block";
        result.classList.add("show");

        result.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        result.classList.remove("flash");
        void result.offsetWidth;
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

    loadState(); // ✅ теперь загружает title, description, theme, wallets

    initMainFields();
    initButtons();
    renderWallets();
}

init();