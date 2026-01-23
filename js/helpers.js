// helpers.js
export function animateNumber(el, newValue) {
  if (!el) return;
  const duration = 600;
  const start = parseInt((el.innerText || "0").replace(/,/g, ""), 10) || 0;
  const end = parseInt(newValue, 10) || 0;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(start + (end - start) * progress);
    el.innerText = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

export function getUploadsPlaylistId(channelId) {
  return "UU" + channelId.substring(2);
}

export function getTotalLikes(videos) {
  return videos.reduce((sum, v) => sum + (v.likes || 0), 0);
}