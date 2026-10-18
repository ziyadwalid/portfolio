const { chromium } = require('playwright-core');
const path = require('path');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',headless:true});
 const out=p=>path.join('docs','screenshots',p);
 async function shot(name,{url,width,height,locale='en-US',selector=null,fullPage=false}){
   const page=await browser.newPage({viewport:{width,height},locale});
   await page.goto('http://127.0.0.1:5173'+url,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(900);
   if(selector){ const el=page.locator(selector); await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(500); await el.screenshot({path:out(name),type:'jpeg',quality:88}); }
   else { await page.screenshot({path:out(name),type:'jpeg',quality:86,fullPage}); }
   console.log(name, Math.round(require('fs').statSync(out(name)).size/1024)+'KB');
   await page.close();
 }
 await shot('home-desktop.jpg',{url:'/?lang=en',width:1440,height:1000});
 await shot('home-arabic.jpg',{url:'/?lang=ar',width:1440,height:1000,locale:'ar-EG'});
 await shot('home-mobile.jpg',{url:'/?lang=en',width:390,height:844});
 await shot('cv-desktop.jpg',{url:'/cv?lang=en',width:1440,height:1100,selector:'.cv-sheet'});
 await shot('project-ui.jpg',{url:'/work/ui-motion-study?lang=en',width:1440,height:1000});
 await shot('project-creative.jpg',{url:'/work/creative-editing-study?lang=en',width:1440,height:1000});
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
