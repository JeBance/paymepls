import { state, addWallet, removeWallet, updateWalletName, updateWalletValue } from "./store.js";
import { escapeHTML } from "./utils.js";

export function renderWallets() {
    const list = document.getElementById("wallet-list");
    list.innerHTML = "";

    // Если нет кошельков — добавляем невидимую заглушку,
    // чтобы сетка считала, что есть как минимум один элемент в левом столбце
    if (state.wallets.length === 0) {
        const placeholder = document.createElement("div");
        placeholder.className = "card";
        placeholder.style.visibility = "hidden";
        list.appendChild(placeholder);
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

        list.appendChild(div);
    });

    // Добавляем карточку «+» всегда в конец списка
    const addCard = document.createElement("div");
    addCard.className = "wallet-add-card";
    addCard.id = "add-wallet-card";
    addCard.innerHTML = `<i class="fas fa-plus"></i>`;
    addCard.addEventListener("click", () => {
        addWallet();
        renderWallets();
    });
    list.appendChild(addCard);

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
    // Функция остаётся для совместимости, но логика клика теперь
    // живёт внутри renderWallets в addCard.addEventListener.
    const card = document.getElementById("add-wallet-card");
    if (card) {
        card.addEventListener("click", () => {
            addWallet();
            renderWallets();
        });
    }
}