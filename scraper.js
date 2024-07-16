const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

// Read configuration from a JSON file
const config = JSON.parse(fs.readFileSync('config.json'));

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for (const url of config.urls) {
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Extract HTML content
        const html = await page.content();
        const $ = cheerio.load(html);

        // Remove overlays and popups (example)
        $('.overlay, .popup').remove();

        // Extract data
        const data = extractData($);

        // Save data
        saveData(url, data);
    }

    await browser.close();
})();

function extractData($) {
    // Example: Extract all paragraphs
    const content = [];
    $('p').each((i, el) => {
        content.push($(el).text());
    });
    return content;
}

function saveData(url, data) {
    const fileName = `output_${url.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
}
