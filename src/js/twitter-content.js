function getComposerContent(tweetButton) {
    const composerRoot = tweetButton.closest('[data-testid="tweetButtonInline"]')
        ? document.querySelector('[data-testid="tweetTextarea_0"]')?.closest('[data-contents="true"]')?.closest('div[class]')?.parentElement
        : tweetButton.closest('div[role="dialog"]') || document.querySelector('[data-testid="tweetTextarea_0"]')?.closest('div[class]')?.parentElement;
    const textarea = composerRoot?.querySelector('[data-testid="tweetTextarea_0"]');
    const text = textarea?.closest('[contenteditable="true"]')?.textContent
        || textarea?.textContent
        || '';
    const mediaUrls = [];
    const attachments = composerRoot?.querySelectorAll('[data-testid="attachments"] img') || [];
    attachments.forEach(img => {
        if (img.src && img.src.startsWith('https://pbs.twimg.com/')) mediaUrls.push(img.src);
    });
    const videos = composerRoot?.querySelectorAll('[data-testid="attachments"] video') || [];
    videos.forEach(video => {
        if (video.src) mediaUrls.push(video.src);
        const source = video.querySelector('source');
        if (source?.src) mediaUrls.push(source.src);
    });
    return { text: text.trim(), mediaUrls };
}
function setupAutoPost() {
    document.addEventListener('click', (e) => {
        const tweetButton = e.target.closest('[data-testid="tweetButton"], [data-testid="tweetButtonInline"]');
        if (!tweetButton) return;
        chrome.storage.local.get('autoPostEnabled', (result) => {
            if (!result.autoPostEnabled) return;
            const { text, mediaUrls } = getComposerContent(tweetButton);
            if (!text && mediaUrls.length === 0) return;
            const parts = [text, ...mediaUrls].filter(Boolean);
            const draft = parts.join('\n');
            const draftUrl = 'https://app.yourplace.network/?draft=' + encodeURIComponent(draft);
            window.open(draftUrl, '_blank');
        });
    }, true);
}
setupAutoPost();
function getTweetUrl(tweet) {
    const timeElement = tweet.querySelector('time');
    if (timeElement) {
        const linkElement = timeElement.closest('a');
        if (linkElement && linkElement.href.includes('/status/')) {
            return linkElement.href;
        }
    }
    return null;
}
function addButtonToTweets() {
    const tweets = document.querySelectorAll('article[data-testid="tweet"]');
    tweets.forEach(tweet => {
        if (!tweet.querySelector('.yourplace-twitter-button')) {
            const button = document.createElement('button');
            button.className = 'yourplace-twitter-button';
            const icon = document.createElement('img');
            icon.src = chrome.runtime.getURL('yourplace-logo.svg');
            icon.alt = 'YourPlace';
            icon.className = 'button-icon';
            button.appendChild(icon);
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const tweetUrl = getTweetUrl(tweet);
                if (tweetUrl) {
                    const draftUrl = 'https://app.yourplace.network/?draft=' + encodeURIComponent(' ' + tweetUrl);
                    window.open(draftUrl, '_blank');
                }
            });
            const actionsContainer = tweet.querySelector('[role="group"]');
            if (actionsContainer) {
                actionsContainer.appendChild(button);
            }
        }
    });
}

// Run initially
addButtonToTweets();

// Create an observer to handle dynamically loaded tweets
const observer = new MutationObserver(() => {
    addButtonToTweets();
});

// Start observing the document
observer.observe(document.body, {
    childList: true,
    subtree: true
});