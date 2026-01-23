// share.js

export function setupShareButton() {
  const btn = document.getElementById("share-btn");
  if (!btn) return;

  const subscribeUrl = `https://www.youtube.com/channel/UCEC5OcghM849ZBAbrSr8EUw?sub_confirmation=1`;

  btn.addEventListener("click", async () => {
    const shareData = {
      title: "Subscribe to XP-Devotion",
      text:  "Join the journey — subscribe now!",
      url:   subscribeUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        btn.innerText = "Link Copied!";
        setTimeout(() => btn.innerText = "Share Channel", 1500);
      }
    } catch {
      // ignore cancel or errors
    }
  });
}

export function setupFooterShareLink() {
  const link = document.getElementById("shareLink");
  const resultEl = document.querySelector(".share-result");
  if (!link) return;

  link.addEventListener("click", async (e) => {
    e.preventDefault();
    const shareData = {
      title: "XP-Devotion Dashboard",
      text:  "Check out this dashboard and subscribe!",
      url:   window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        if (resultEl) {
          resultEl.textContent = "Link copied!";
          setTimeout(() => resultEl.textContent = "", 2000);
        }
      }
    } catch {}
  });
}

export function makeQR(id, url) {
  const el = document.getElementById(id);
  if (!el) return;
  el.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
}