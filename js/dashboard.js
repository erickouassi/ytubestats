// dashboard.js
import { animateNumber, getTotalLikes } from './helpers.js';
import { fetchChannelData, fetchVideoIds, fetchVideoStats } from './youtube-api.js';
import { updateNextBadgeIndicators, updateBadges } from './badges.js';
import { setupShareButton, setupFooterShareLink, makeQR } from './share.js';
import { renderRow } from './video-table.js';
import { qrCodes } from './config.js';

function generateQrHtml(qrCodes) {
  const items = Object.entries(qrCodes).map(([key, url]) => `
    <div class="qr-item">
      <img src="" id="qr-${key}" alt="${key.charAt(0).toUpperCase() + key.slice(1)} QR" />
      <div class="qr-caption">${key.charAt(0).toUpperCase() + key.slice(1)}</div>
    </div>
  `);

  return `
    <div class="qr-row">
      ${items.join('')}
    </div>
  `;
}

export async function loadDashboard() {
  try {
    // ── Channel info ───────────────────────────────────────
    const info = await fetchChannelData();

    const nameEl   = document.getElementById("channel-name");
    const imgEl    = document.getElementById("channel-image");
    const subsEl   = document.getElementById("subscriber-count");
    const viewsEl  = document.getElementById("view-count");
    const videosEl = document.getElementById("video-count");

    if (nameEl)   nameEl.textContent = info.name;
    if (imgEl)    imgEl.src = info.image;

    if (subsEl)   animateNumber(subsEl, info.subs);
    if (viewsEl)  animateNumber(viewsEl, info.views);
    if (videosEl) animateNumber(videosEl, info.videos);

    // ── Videos ─────────────────────────────────────────────
    const ids = await fetchVideoIds();
    const videos = await fetchVideoStats(ids);

    const totalLikes = getTotalLikes(videos);
    animateNumber(document.getElementById("like-count"), totalLikes);

    const sorted = videos.slice().sort((a, b) => b.views - a.views);

    const topBody = document.querySelector("#top-table tbody");
    const lowBody = document.querySelector("#low-table tbody");

    if (topBody) topBody.innerHTML = sorted.slice(0, 5).map(renderRow).join("");
    if (lowBody) lowBody.innerHTML = sorted.slice(-5).map(renderRow).join("");

    // ── Badges ────────────────────────────
    await updateNextBadgeIndicators(info.subs, info.views, totalLikes);
    await updateBadges(info.subs, info.views, totalLikes);

    setupShareButton();
    setupFooterShareLink();

    // ── QR codes container ─────────────────────────────────
    const qrContainer = document.getElementById("qr-container");
    if (qrContainer) {
      qrContainer.innerHTML = generateQrHtml(qrCodes);

      Object.entries(qrCodes).forEach(([key, url]) => {
        makeQR(`qr-${key}`, url);
      });
    }

  } catch (err) {
    console.error("Dashboard failed:", err);
  }
}