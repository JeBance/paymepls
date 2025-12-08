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

const STORAGE_KEY = "paymepls-state";

export function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
        const data = JSON.parse(saved);

        state.title = data.title || "";
        state.description = data.description || "";
        state.theme = data.theme || "classic";
        state.wallets = Array.isArray(data.wallets) ? data.wallets : [];

    } catch {
        // если что-то повреждено — просто игнорируем
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