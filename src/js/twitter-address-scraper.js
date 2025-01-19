async function scrapeBaseAddresses() {
    // Check if we're on the correct page
    const currentUrl = window.location.href;
    const correctUrl = 'https://x.com/search?q=.base.eth&src=typed_query&f=user';

    if (!currentUrl.startsWith(correctUrl)) {
        console.log('Please navigate to the correct search page first:', correctUrl);
        return;
    }

    const baseAddresses = new Set();
    let lastHeight = 0;
    let scrollAttempts = 0;
    const maxScrollAttempts = 1000;

    // Random delay function between min and max milliseconds
    function randomDelay(min, max) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    function cleanAddress(text) {
        if (!text) return null;
        text = text.toLowerCase().trim();

        if (!text.endsWith('.base.eth')) return null;

        // Remove everything before the last pipe or vertical bar if it exists
        if (text.includes('|')) {
            text = text.split('|').pop().trim();
        }

        // Remove everything before any common separators
        text = text.split('/').pop().trim();
        text = text.split('//').pop().trim();

        // Remove parentheses and their contents
        text = text.replace(/\s*\([^)]*\)/g, '');

        // Keep only alphanumeric, dots, and hyphens
        text = text.replace(/[^a-z0-9\-\.]/g, '');

        // Validate final format
        if (!text.match(/^[a-z0-9\-]+\.base\.eth$/)) return null;

        return text;
    }

    while (scrollAttempts < maxScrollAttempts) {
        const userCells = document.querySelectorAll('[data-testid="UserCell"]');

        userCells.forEach(cell => {
            const textElements = cell.querySelectorAll('[dir="ltr"] span');
            textElements.forEach(element => {
                const text = element.textContent;
                const baseAddress = cleanAddress(text);
                if (baseAddress) {
                    baseAddresses.add(baseAddress);
                }
            });
        });

        // Scroll with random delay
        window.scrollTo(0, document.body.scrollHeight);
        await randomDelay(1200, 2800); // Random delay between 1.2 and 2.8 seconds

        // Add small random movements after main scroll
        if (Math.random() > 0.7) { // 30% chance of small scroll adjustment
            const smallScroll = Math.floor(Math.random() * 100) - 50; // Random scroll between -50 and +50 pixels
            window.scrollBy(0, smallScroll);
            await randomDelay(300, 800);
        }

        const currentHeight = document.body.scrollHeight;
        if (currentHeight === lastHeight) {
            break;
        }
        lastHeight = currentHeight;
        scrollAttempts++;

        // Log progress
        console.log(`Scroll attempt ${scrollAttempts}/${maxScrollAttempts}, found ${baseAddresses.size} addresses so far`);
    }

    const results = Array.from(baseAddresses)
        .filter(addr => addr.length > 9) // Minimum length of "x.base.eth"
        .sort(); // Sort alphabetically

    console.log('Found .base.eth addresses:', results);

    // Create the download
    const content = results.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.download = `base_eth_addresses_${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return results;
}

// Only execute if we're on the correct page
const correctUrl = 'https://x.com/search?q=.base.eth&src=typed_query&f=user';
if (window.location.href.startsWith(correctUrl)) {
    //scrapeBaseAddresses();
}