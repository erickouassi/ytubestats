// youtube-api.js
import { CHANNEL_ID, API_KEY } from './config.js';
import { getUploadsPlaylistId } from './helpers.js';

export async function fetchChannelData() {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();
  if (!data.items?.length) throw new Error("Channel not found");

  const item = data.items[0];
  return {
    name:  item.snippet.title,
    image: item.snippet.thumbnails.high.url,
    subs:  Number(item.statistics.subscriberCount || 0),
    views: Number(item.statistics.viewCount      || 0),
    videos:Number(item.statistics.videoCount     || 0)
  };
}

export async function fetchVideoIds() {
  const playlistId = getUploadsPlaylistId(CHANNEL_ID);
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistId}&maxResults=50&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();
  return (data.items || []).map(i => i.contentDetails.videoId);
}

export async function fetchVideoStats(ids) {
  if (!ids.length) return [];
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${ids.join(",")}&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();
  return (data.items || []).map(v => ({
    id:    v.id,
    title: v.snippet.title,
    thumb: v.snippet.thumbnails.medium.url,
    views: Number(v.statistics.viewCount || 0),
    likes: Number(v.statistics.likeCount || 0),
    date:  v.snippet.publishedAt
  }));
}