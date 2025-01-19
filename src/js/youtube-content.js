function addCustomShareButton() {
    const sharePanel = document.querySelector('yt-third-party-share-target-section-renderer');
    if (!sharePanel) return;

    // Check if our button already exists to avoid duplicates
    if (document.querySelector('.yourplace-youtube-share-button')) return;

    // Create the button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'yourplace-youtube-share-button';
    buttonContainer.style.cssText = `
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 4px;
    margin: 8px;
  `;

    // Create the icon
    const icon = document.createElement('img');
    icon.src = chrome.runtime.getURL('yourplace-logo.svg');
    icon.style.width = '24px';
    icon.style.height = '24px';
    icon.style.marginRight = '8px';

    // Create the text
    const text = document.createElement('span');
    text.textContent = 'Custom Share';
    text.style.color = 'var(--yt-spec-text-primary)';

    // Add click handler
    buttonContainer.addEventListener('click', () => {
        // Add your custom share functionality here
        console.log('Custom share clicked!');
    });

    // Assemble the button
    buttonContainer.appendChild(icon);
    buttonContainer.appendChild(text);

    // Add the button to the share panel
    const shareOptions = sharePanel.querySelector('#share-target-options');
    if (shareOptions) {
        shareOptions.appendChild(buttonContainer);
    }
}

// Watch for the share modal to appear
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeName === 'yt-third-party-share-target-section-renderer') {
                addCustomShareButton();
            }
        });
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});