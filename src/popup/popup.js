const DOM = {
  autoPostToggle: document.getElementById('autoPostToggle'),
  openYourPlace: document.getElementById('openYourPlace')
};
chrome.storage.local.get('autoPostEnabled', (result) => {
  DOM.autoPostToggle.checked = result.autoPostEnabled || false;
});
DOM.autoPostToggle.addEventListener('change', () => {
  chrome.storage.local.set({ autoPostEnabled: DOM.autoPostToggle.checked });
});
DOM.openYourPlace.addEventListener('click', () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);
  fetch('http://localhost:42424/ping', { method: 'GET', signal: controller.signal })
    .then(response => {
      clearTimeout(timeoutId);
      if (!response.ok) {
        chrome.tabs.create({ url: 'https://app.yourplace.network' });
        return;
      }
      return response.json();
    })
    .then(data => {
      if (!data) return;
      const url = data.status === 'pong' ? 'http://localhost:42424/' : 'https://app.yourplace.network';
      chrome.tabs.create({ url });
    })
    .catch(() => {
      clearTimeout(timeoutId);
      chrome.tabs.create({ url: 'https://app.yourplace.network' });
    });
});
