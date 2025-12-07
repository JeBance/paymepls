import { state, addWallet, removeWallet, updateWalletName, updateWalletValue } from "./store.js";
import { escapeHTML } from "./utils.js";

export function renderWallets() {
    const list = document.getElementById("wallet-list");
    const addCard = document.getElementById("add-wallet-card");

    list.innerHTML = "";

    if (state.wallets.length === 0) {
        // Пустой список: сначала кнопка, потом заглушка
        list.appendChild(addCard);

        const placeholder = document.createElement("div");
        placeholder.className = "card";
        placeholder.style.visibility = "hidden";
        list.appendChild(placeholder);
    } else {
        // Есть кошельки: сначала кошельки, потом кнопка
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

        list.appendChild(addCard);
    }

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