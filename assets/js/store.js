/* ============================================================
   СОСТОЯНИЕ ПРИЛОЖЕНИЯ
   (вынесено из index.html без изменений логики)
============================================================ */

export const state = {
    title: "",
    description: "",
    theme: "classic",
    wallets: []
};

/* ============================================================
   МЕТОДЫ РАБОТЫ С КОШЕЛЬКАМИ
============================================================ */

/**
 * Добавляет новый кошелёк
 */
export function addWallet(data = { name: "", value: "" }) {
    const id = Date.now();
    state.wallets.push({ id, ...data });
}

/**
 * Удаляет кошелёк по ID
 */
export function removeWallet(id) {
    state.wallets = state.wallets.filter(w => w.id !== id);
}

/**
 * Обновляет название кошелька
 */
export function updateWalletName(id, name) {
    const w = state.wallets.find(w => w.id === id);
    if (w) w.name = name;
}

/**
 * Обновляет реквизиты кошелька
 */
export function updateWalletValue(id, value) {
    const w = state.wallets.find(w => w.id === id);
    if (w) w.value = value;
}