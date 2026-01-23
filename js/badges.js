// badges.js
import { getAllBadges } from './badges-data.js';

export async function updateNextBadgeIndicators(subs, views, likes) {
  const allBadges = await getAllBadges();

  const subsNextEl  = document.getElementById("next-subs-badge");
  const viewsNextEl = document.getElementById("next-views-badge");
  const likesNextEl = document.getElementById("next-likes-badge");

  const nextSubs = allBadges
    .filter(b => b.type === "subs" && b.value > subs)
    .sort((a, b) => a.value - b.value)[0];

  const nextViews = allBadges
    .filter(b => b.type === "views" && b.value > views)
    .sort((a, b) => a.value - b.value)[0];

  const nextLikes = allBadges
    .filter(b => b.type === "likes" && b.value > likes)
    .sort((a, b) => a.value - b.value)[0];

  if (subsNextEl) {
    subsNextEl.textContent = nextSubs
      ? `Next badge in ${(nextSubs.value - subs).toLocaleString()} subs`
      : "All subscriber badges unlocked";
  }

  if (viewsNextEl) {
    viewsNextEl.textContent = nextViews
      ? `Next badge in ${(nextViews.value - views).toLocaleString()} views`
      : "All view badges unlocked";
  }

  if (likesNextEl) {
    likesNextEl.textContent = nextLikes
      ? `Next badge in ${(nextLikes.value - likes).toLocaleString()} likes`
      : "All like badges unlocked";
  }
}

export async function updateBadges(subs, views, likes) {
  const allBadges = await getAllBadges();

  const subsRow  = document.getElementById("subs-badge-row");
  const viewsRow = document.getElementById("views-badge-row");
  const likesRow = document.getElementById("likes-badge-row");

  if (!subsRow || !viewsRow || !likesRow) return;

  subsRow.innerHTML = "";
  viewsRow.innerHTML = "";
  likesRow.innerHTML = "";

  allBadges.forEach(badge => {
    const wrapper = document.createElement("div");
    wrapper.className = "badge-wrapper";

    let progress = 0;
    if (badge.type === "subs") {
      progress = Math.min(subs / badge.value, 1);
    } else if (badge.type === "views") {
      progress = Math.min(views / badge.value, 1);
    } else if (badge.type === "likes") {
      progress = Math.min(likes / badge.value, 1);
    }

    const circumference = 2 * Math.PI * 40;
    const isActive = progress >= 1;

    wrapper.innerHTML = `
      <svg class="progress-ring" width="90" height="90">
        <circle
          stroke="#ddd"
          stroke-width="6"
          fill="transparent"
          r="40"
          cx="45"
          cy="45"
        ></circle>
        <circle
          class="progress-ring-fill"
          stroke="${isActive ? "#00c853" : "#ff0000"}"
          stroke-width="6"
          fill="transparent"
          r="40"
          cx="45"
          cy="45"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${circumference - progress * circumference}"
        ></circle>
      </svg>
      <div
        class="badge ${isActive ? "active" : ""}"
        data-label="${badge.label}"
        data-value="${badge.value}"
        data-progress="${progress}"
        data-message="${badge.message}"
        data-reward="${badge.reward}"
        data-type="${badge.type}"
      >
        ${badge.label}
      </div>
    `;

    if (badge.type === "subs") {
      subsRow.appendChild(wrapper);
    } else if (badge.type === "views") {
      viewsRow.appendChild(wrapper);
    } else if (badge.type === "likes") {
      likesRow.appendChild(wrapper);
    }
  });

  setupBadgeModal();
}

function setupBadgeModal() {
  const modal = document.getElementById("badge-modal");
  const closeBtn = document.getElementById("modal-close");
  if (!modal || !closeBtn) return;

  const titleEl   = document.getElementById("modal-title");
  const reqEl     = document.getElementById("modal-requirement");
  const progEl    = document.getElementById("modal-progress");
  const progFillEl= document.getElementById("modal-progress-fill");
  const msgEl     = document.getElementById("modal-message");

  document.querySelectorAll(".badge").forEach(badgeEl => {
    badgeEl.addEventListener("click", () => {
      const label    = badgeEl.dataset.label   || "";
      const value    = parseInt(badgeEl.dataset.value   || "0", 10);
      const progress = parseFloat(badgeEl.dataset.progress || "0");
      const message  = badgeEl.dataset.message  || "";
      const reward   = badgeEl.dataset.reward   || "";

      if (titleEl)    titleEl.innerText = label;
      if (reqEl)      reqEl.innerText = `Requires: ${value.toLocaleString()}`;
      if (progEl)     progEl.innerText = `Progress: ${(progress * 100).toFixed(1)}%`;
      if (progFillEl) progFillEl.style.width = `${Math.min(progress * 100, 100)}%`;

      if (msgEl) {
        msgEl.innerText = progress >= 1
          ? `🎉 You unlocked this badge! ${message} ${reward ? "Reward: " + reward : ""}`
          : `${message} ${reward ? "Reward: " + reward : ""}`;
      }

      modal.style.display = "flex";
    });
  });

  closeBtn.onclick = () => { modal.style.display = "none"; };

  window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });
}