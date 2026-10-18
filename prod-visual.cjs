const { chromium } = require('playwright-core');
(async()=>{
 const b=await chromium.launch({executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',headless:true});
 const p=await b.newPage({viewport:{width:1440,height:1000},locale:'en-US'});
 await p.goto('http://127.0.0.1:4173/cv?lang=en',{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(700);
 await p.locator('.cv-sheet').screenshot({path:'.tmp/review/prod-cv-sheet.png'});
 console.log('cv',await p.evaluate(()=>({bg:getComputedStyle(document.querySelector('.cv-sheet')).backgroundColor, heading:getComputedStyle(document.querySelector('.cv-section__head h3')).color, email:document.querySelector('.cv-sheet__contact-links a')?.textContent})));
 await p.goto('http://127.0.0.1:4173/work/ui-motion-study?lang=en',{waitUntil:'networkidle'}); await p.waitForTimeout(600);
 await p.locator('.project-stage').scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
 console.log('stage',await p.evaluate(()=>{const v=document.querySelector('.project-player video');const r=v.getBoundingClientRect();return{ratio:+(r.width/r.height).toFixed(3),w:v.videoWidth,h:v.videoHeight,src:v.getAttribute('src')}}));
 await p.screenshot({path:'.tmp/review/prod-ui-stage.png'});
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
