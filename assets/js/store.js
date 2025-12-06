/* ============================================================
   СОСТОЯНИЕ ПРИЛОЖЕНИЯ
============================================================ */

export const state = {
    title: "",
    description: "",
    theme: "classic",
    wallets: []
};

export function addWallet(data = { name: "", value: "" }) {
    const id = Date.now();
    state.wallets.push({ id, ...data });
}

export function removeWallet(id) {
    state.wallets = state.wallets.filter(w => w.id !== id);
}

export function updateWalletName(id, name) {
    const w = state.wallets.find(w => w.id === id);
    if (w) w.name = name;
}

export function updateWalletValue(id, value) {
    const w = state.wallets.find(w => w.id === id);
    if (w) w.value = value;
}