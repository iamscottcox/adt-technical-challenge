const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false});
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await page.screenshot({ path: 'screenshots/example.png' });

  const markers = await page.$$(".maplibregl-marker.mapboxgl-marker.maplibregl-marker-anchor-center.mapboxgl-marker-anchor-center")

  await Promise.all(
    markers.map(async (marker) => {
      await marker.click()
  
      const popup = await page.$(".maplibregl-popup-content.mapboxgl-popup-content");
  
      if (popup === undefined) {
        console.error('No popup was displayed for this marker');
      }

      const closeButton = await page.$('button.maplibregl-popup-close-button.mapboxgl-popup-close-button')

      await closeButton.click();
    })
  )

  await browser.close();
})();