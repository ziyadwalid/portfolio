const { chromium } = require('playwright-core');
(async()=>{
 const b=await chromium.launch({executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',headless:true});
 const p=await b.newPage({viewport:{width:1440,height:1000},locale:'en-US'});
 await p.goto('http://127.0.0.1:5173/cv?lang=en',{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(500);
 console.log(await p.evaluate(()=>({cvEmail:[...document.querySelectorAll('.cv-sheet__contact-links a')].map(a=>({text:a.textContent.trim(),href:a.getAttribute('href')})).slice(0,1),badge:document.querySelector('.cv-sheet__tagline')?.textContent?.trim(),note:document.querySelector('.cv-sheet__footer')?.textContent?.trim(),works:document.querySelectorAll('.cv-work-list__item').length,collabs:document.querySelectorAll('.cv-collaboration').length,langs:document.querySelector('.cv-language-list')?.innerText})));
 await p.goto('http://127.0.0.1:5173/?lang=en',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
 console.log(await p.evaluate(()=>({mail:document.querySelector('.contact-channels a[href^="mailto:"]')?.innerText,href:document.querySelector('.contact-channels a[href^="mailto:"]')?.getAttribute('href'),count:document.querySelectorAll('.work-tile').length,workCount:document.querySelector('#work .section-heading__aside-meta .mono-label')?.textContent?.trim(),heroIndex:document.querySelector('.hero__bottom-index')?.textContent?.trim()})));
 await p.locator('#work').scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
 await p.screenshot({path:'.tmp/review/work-heading.png'});
 await p.locator('#contact').scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
 await p.locator('.contact__direct').screenshot({path:'.tmp/review/contact-direct.png'});
 await p.goto('http://127.0.0.1:5173/cv?lang=en',{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(500);
 await p.screenshot({path:'.tmp/review/cv-fresh.jpg'});
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
