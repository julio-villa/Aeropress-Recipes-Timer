const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // Dynamic import for fetch
const cheerio = require('cheerio');
const app = express();

app.use(cors())


app.get('/data', async (req, res) => {
    const url = 'https://aeroprecipe.com';
    try {
        const response = await fetch(url);
        if (!response.ok) { // Check if the HTTP response status code is not okay.
            throw new Error(`Failed to fetch from ${url}, status code: ${response.status}`);
        }
        const html = await response.text();
        const $ = cheerio.load(html);
        const recipes = [];
        $('#recipes a.recipeCard').each((index, element) => {
            const title = $(element).attr('data-title');
            const id = $(element).attr('href');
            const description = $(element).find('p').text().trim();
            // Extract additional details here
            recipes.push({ title, id, description });
        });
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: error.message });
    }
});




const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
