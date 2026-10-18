const { chromium } = require('playwright-core');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000},locale:'en-US'});
 await page.goto('http://127.0.0.1:5173/cv?lang=en',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(800);
 console.log(await page.evaluate(()=>({cvContact:[...document.querySelectorAll('.cv-sheet__contact-links a')].map(a=>({text:a.textContent.trim(),href:a.getAttribute('href')})),pageText:document.body.innerText.includes('zeadwalid56@gmail.com')})));
 await page.goto('http://127.0.0.1:5173/?lang=en',{waitUntil:'networkidle'}); await page.waitForTimeout(500);
 console.log(await page.evaluate(()=>({mailtos:[...document.querySelectorAll('a[href^="mailto:"]')].map(a=>({text:a.textContent.trim(),href:a.getAttribute('href')})), placeholders:document.body.innerText.includes('your.email@example.com')})));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
