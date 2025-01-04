chrome.action.onClicked.addListener((tab) => {
    fetch('http://127.0.0.1:42424/ping', {
        method: 'GET',
        mode: 'no-cors',
        timeout: 2000
    })
        .then(response => {
            // Server is alive
            chrome.tabs.create({ url: 'http://127.0.0.1:42424/' });
        })
        .catch(error => {
            // Server is not responding, redirect
            chrome.tabs.create({ url: 'https://yourplace.network/download' });
        });
});