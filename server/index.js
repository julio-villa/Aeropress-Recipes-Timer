const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // Dynamic import for fetch
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const app = express();

app.use(cors())

async function scrapeRecipes() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setRequestInterception(true);
        page.on('request', (req) => {
        if (['image', 'stylesheet', 'font', 'media', 'texttrack', 'object', 'beacon', 'csp_report', 'imageset'].indexOf(req.resourceType()) !== -1) {
            req.abort();
        } else {
            req.continue();
        }
        });
    await page.goto('https://aeroprecipe.com', {waitUntil: 'networkidle0'}); // Waits until the page is fully loaded
    const recipes = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('#recipes a.recipeCard'));
        return cards.map(card => {
            const title = card.getAttribute('data-title');  // Get the title from data-title attribute
            const href = card.getAttribute('href');  // Get the href as an ID
            const descriptionElement = card.querySelector('p');  // Find the <p> tag for the description
            const description = descriptionElement ? descriptionElement.textContent.trim() : '';  // Safely get the text content
            return {
                title,
                href,
                description  // Return all the parts as an object
            };
        });
    });
    await browser.close();
    return recipes;
}


app.get('/data', async (req, res) => {
    try {
        const recipes = await scrapeRecipes();
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: error.message });
    }
});




const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
