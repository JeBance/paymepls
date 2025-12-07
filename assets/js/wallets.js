import { state, addWallet, removeWallet, updateWalletName, updateWalletValue } from "./store.js";
import { escapeHTML } from "./utils.js";

export function renderWallets() {
    const list = document.getElementById("wallet-list");

    // Очищаем всё, кроме кнопки «+»
    const addCard = document.getElementById("add-wallet-card");
    list.innerHTML = "";
    list.appendChild(addCard);

    // Если нет кошельков — добавим невидимую заглушку перед «+»
    if (state.wallets.length === 0) {
        const placeholder = document.createElement("div");
        placeholder.className = "card";
        placeholder.style.visibility = "hidden";
        list.insertBefore(placeholder, addCard);
    }

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

        list.insertBefore(div, addCard);
    });

    document.querySelectorAll(".wallet-name").forEach(input => {
        input.addEventListener("input", e => {
            const id = Number(e.target.dataset.id);
            updateWalletName(id, e.target.value);
        });
    });

    document.querySelectorAll(".wallet-value").forEach(input => {
        input.addEventListener("input", e => {
            const id = Number(e.target.dataset.id);
            updateWalletValue(id, e.target.value);
        });
    });

    document.querySelectorAll("[data-remove]").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.remove);
            removeWallet(id);
            renderWallets();
        });
    });
}

export function initAddWalletButton() {
    const card = document.getElementById("add-wallet-card");
    if (!card) return;

    card.addEventListener("click", () => {
        addWallet();
        renderWallets();
    });
}