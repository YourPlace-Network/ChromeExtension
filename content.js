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
                alert('Button clicked!');
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