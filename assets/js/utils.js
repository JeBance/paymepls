/* ============================================================
   УТИЛИТЫ
============================================================ */

export function escapeHTML(str) {
    return str.replace(/[&<>"']/g, m => ({
        '&':'&amp;',
        '<':'&lt;',
        '>':'&gt;',
        '"':'&quot;',
        "'":'&#39;'
    }[m]));
}

export function getQRSize() {
    if (window.innerWidth < 480) return 120;
    if (window.innerWidth < 768) return 150;
    return 180;
}