import { escapeHTML, getQRSize } from "./utils.js";

export function renderViewMode(data) {
    document.getElementById("constructor").style.display = "none";
    document.getElementById("result").style.display = "none";

    const view = document.getElementById("view-mode");
    view.style.display = "block";

    const container = document.getElementById("payment-page-container");
    container.innerHTML = "";

    const title = document.createElement("h1");
    title.textContent = data.title || "Реквизиты";
    title.style.textAlign = "center";
    title.style.marginBottom = "20px";
    title.style.lineHeight = "1.3";
    container.appendChild(title);

    if (data.description) {
        const desc = document.createElement("p");
        desc.textContent = data.description;
        desc.style.textAlign = "center";
        desc.style.margin = "0 auto 36px auto";
        desc.style.maxWidth = "700px";
        desc.style.lineHeight = "1.55";
        container.appendChild(desc);
    }

    const grid = document.createElement("div");
    grid.className = "grid grid-2";
    grid.style.marginTop = "20px";
    grid.style.maxWidth = "1000px";
    grid.style.marginLeft = "auto";
    grid.style.marginRight = "auto";
    container.appendChild(grid);

    data.wallets.forEach(wallet => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.padding = "32px";

        card.innerHTML = `
            <h3 style="margin-bottom:14px;">${escapeHTML(wallet.name)}</h3>
            <p style="margin-bottom:22px; line-height:1.45; word-break:break-word;">${escapeHTML(wallet.value)}</p>

            <div class="qr-box" id="qr-view-${wallet.id}" style="margin-bottom:24px;"></div>

            <button class="btn" style="margin-top:8px;" data-copy="${escapeHTML(wallet.value)}">
                <i class="fas fa-copy"></i> Скопировать
            </button>
        `;

        grid.appendChild(card);

        const qrSize = Math.max(getQRSize(), 140);

        new QRCode(document.getElementById(`qr-view-${wallet.id}`), {
            text: wallet.value,
            width: qrSize,
            height: qrSize
        });
    });

    document.querySelectorAll("[data-copy]").forEach(btn => {
        btn.addEventListener("click", () => {
            navigator.clipboard.writeText(btn.dataset.copy);
        });
    });
}