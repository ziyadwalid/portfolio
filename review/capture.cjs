const { chromium } = require('playwright-core');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000},locale:'en-US'});
 const errs=[]; page.on('console',m=>{if(m.type()==='error')errs.push(m.text())}); page.on('pageerror',e=>errs.push(e.message));
 await page.goto('http://127.0.0.1:5173/?lang=en',{waitUntil:'domcontentloaded'});
 await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(1200);
 await page.locator('#work').scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
 await page.screenshot({path:'.tmp/review/work-top.jpg'});
 await page.locator('.work-secondary').scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
 await page.screenshot({path:'.tmp/review/work-secondary.jpg'});
 await page.locator('.work-secondary').screenshot({path:'.tmp/review/work-secondary-full.jpg'});
 await page.goto('http://127.0.0.1:5173/work/ui-motion-study?lang=en',{waitUntil:'domcontentloaded'}); await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(800);
 await page.screenshot({path:'.tmp/review/project-ui.jpg'});
 await page.locator('.project-stage').scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
 await page.screenshot({path:'.tmp/review/project-ui-stage.jpg'});
 await page.goto('http://127.0.0.1:5173/cv?lang=en',{waitUntil:'domcontentloaded'}); await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(800);
 await page.screenshot({path:'.tmp/review/cv-screen.jpg'});
 await page.locator('.cv-sheet').scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
 await page.screenshot({path:'.tmp/review/cv-screen-full.jpg', fullPage:true});
 // Hover a section to see the interaction, plus move pointer over sheet for spotlight.
 const sheet=page.locator('.cv-sheet'); const box=await sheet.boundingBox();
 if(box){ await page.mouse.move(box.x+box.width*0.6, box.y+box.height*0.3); await page.waitForTimeout(600); }
 await page.screenshot({path:'.tmp/review/cv-screen-pointer.jpg'});
 console.log('errors',errs);
 console.log('project count tiles', await page.locator('.work-tile').count());
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
