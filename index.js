const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = 3000;

app.get("/scrape", async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the page with your HTML content
    await page.goto('https://www.crichd.live/home34');

    // Extract data from the HTML
    const data = await page.evaluate(() => {
      const items = [];
      const rows = document.querySelectorAll('#contentcolumn table tbody tr:not(:first-child)');

      rows.forEach((row) => {
        const dateElement = row.querySelector('.matchtime');
        const leagueElement = row.querySelector('.league a');
        const eventElement = row.querySelector('.gname a');
        const eventLinkElement = row.querySelector('.gname a');

        const rowData = { date: '', league: '', eventElement: '', eventLink: '' };

        // Check if elements exist before accessing their properties
        if (dateElement) {
          rowData.date = dateElement.innerText.trim();
        }
        if (leagueElement) {
          rowData.league = leagueElement.innerText.trim();
        }
        if (eventElement) {
          rowData.eventElement = eventElement.innerText.trim();
        }
        if (eventLinkElement) {
          rowData.eventLink = eventLinkElement.href.trim();
        }

        items.push(rowData);
      });

      return items;
    });

    // Close the browser
    await browser.close();

    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});