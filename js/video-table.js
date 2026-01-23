// video-table.js
export function renderRow(video) {
  const url = `https://www.youtube.com/watch?v=${video.id}`;
  return `
    <tr>
      <td><a href="${url}" target="_blank" rel="noopener"><img src="${video.thumb}" alt="${video.title}" loading="lazy"></a></td>
      <td><a href="${url}" target="_blank" rel="noopener">${video.title}</a></td>
      <td>${video.views.toLocaleString()}</td>
      <td>${new Date(video.date).toLocaleDateString()}</td>
    </tr>
  `;
}