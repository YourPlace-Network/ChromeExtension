function addYourPlaceShareButton() {
    const sharePanel = document.querySelector('yt-third-party-share-target-section-renderer');
    if (!sharePanel) return;
    if (sharePanel.querySelector('.yourplace-youtube-share-button')) return;
    const contentsDiv = sharePanel.querySelector('#contents');
    if (!contentsDiv) return;
    const embedButton = contentsDiv.querySelector('yt-share-target-renderer');
    if (!embedButton) return;
    const button = document.createElement('button');
    button.className = 'yourplace-youtube-share-button';
    button.title = 'YourPlace';
    button.setAttribute('role', 'button');
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'yourplace-youtube-share-icon';
    const icon = document.createElement('img');
    icon.src = chrome.runtime.getURL('yourplace-logo.svg');
    icon.alt = 'YourPlace';
    iconWrapper.appendChild(icon);
    const title = document.createElement('div');
    title.className = 'yourplace-youtube-share-title';
    title.textContent = 'YourPlace';
    button.appendChild(iconWrapper);
    button.appendChild(title);
    button.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const shareInput = document.querySelector('yt-copy-link-renderer #share-url');
        const videoUrl = shareInput ? shareInput.value : window.location.href;
        const draftUrl = 'https://app.yourplace.network/?draft=' + encodeURIComponent(' ' + videoUrl);
        window.open(draftUrl, '_blank');
    });
    embedButton.insertAdjacentElement('afterend', button);
}

const observer = new MutationObserver(() => {
    addYourPlaceShareButton();
});
observer.observe(document.body, {
    childList: true,
    subtree: true
});
