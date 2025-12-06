/* ============================================================
   РЕНДЕРИНГ КОШЕЛЬКОВ В КОНСТРУКТОРЕ
============================================================ */

import { state, addWallet, removeWallet, updateWalletName, updateWalletValue } from "./store.js";
import { escapeHTML } from "./utils.js";
import { renderPreview } from "./preview.js";

/**
 * Рендерит список кошельков в конструкторе
 */
export function renderWallets() {
    const list = document.getElementById("wallet-list");
    list.innerHTML = "";

    state.wallets.forEach(wallet => {
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h3>Кошелёк</h3>

            <label>Название</label>
            <input class="input wallet-name" data-id="${wallet.id}" value="${escapeHTML(wallet.name)}">

            <label style="margin-top:16px;">Реквизиты</label>
            <input class="input wallet-value" data-id="${wallet.id}" value="${escapeHTML(wallet.value)}">

            <button class="btn btn-secondary" style="margin-top:24px;" data-remove="${wallet.id}">
                <i class="fas fa-trash"></i> Удалить
            </button>
        `;

        list.appendChild(div);
    });

    /* Название кошелька */
    document.querySelectorAll(".wallet-name").forEach(input => {
        input.addEventListener("input", e => {
            const id = Number(e.target.dataset.id);
            updateWalletName(id, e.target.value);
            renderPreview();
        });
    });

    /* Реквизиты кошелька */
    document.querySelectorAll(".wallet-value").forEach(input => {
        input.addEventListener("input", e => {
            const id = Number(e.target.dataset.id);
            updateWalletValue(id, e.target.value);
            renderPreview();
        });
    });

    /* Удаление */
    document.querySelectorAll("[data-remove]").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.remove);
            removeWallet(id);
            renderWallets();
            renderPreview();
        });
    });

    renderPreview();
}

/**
 * Обработчик кнопки "Добавить кошелёк"
 */
export function initAddWalletButton() {
    const btn = document.getElementById("add-wallet-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        addWallet();
        renderWallets();
    });
}