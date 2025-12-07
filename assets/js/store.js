/* ============================================================
   СОСТОЯНИЕ ПРИЛОЖЕНИЯ
============================================================ */

export const state = {
    title: "",
    description: "",
    theme: "classic",
    wallets: []
};

let lastDeleted = null;

/* ============================
   LOCAL STORAGE
============================ */

export function saveState() {
    localStorage.setItem("wallets", JSON.stringify(state.wallets));
}

export function loadState() {
    const saved = localStorage.getItem("wallets");
    if (saved) {
        try {
            state.wallets = JSON.parse(saved);
        } catch {
            state.wallets = [];
        }
    }
}

/* ============================
   CRUD
============================ */

export function addWallet(data = { name: "", value: "" }) {
    const id = Date.now();
    state.wallets.push({ id, ...data });
    saveState();
}

export function removeWallet(id) {
    const index = state.wallets.findIndex(w => w.id === id);
    if (index !== -1) {
        lastDeleted = state.wallets[index];
        state.wallets.splice(index, 1);
        saveState();
    }
}

export function undoDelete() {
    if (lastDeleted) {
        state.wallets.push(lastDeleted);
        lastDeleted = null;
        saveState();
    }
}

export function updateWalletName(id, name) {
    const w = state.wallets.find(w => w.id === id);
    if (w) {
        w.name = name;
        saveState();
    }
}

export function updateWalletValue(id, value) {
    const w = state.wallets.find(w => w.id === id);
    if (w) {
        w.value = value;
        saveState();
    }
}