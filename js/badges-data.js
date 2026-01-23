// badges-data.js 

let cachedBadges = null;

export async function getAllBadges() {
  if (cachedBadges !== null) {
    return cachedBadges;
  }

  const path = './js/badges.json';

  //console.log(`[badges-data] Fetching badges from: ${path}`);

  try {
    const response = await fetch(path);
    console.log(`[badges-data] Status: ${response.status}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    cachedBadges = await response.json();
    //console.log("[badges-data] Loaded", cachedBadges.length, "badges");
    return cachedBadges;
  } catch (err) {
    console.error("[badges-data] Failed to load badges:", err);
    return [];
  }

}
