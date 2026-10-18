const { chromium } = require('playwright-core');
(async()=>{
 const b=await chromium.launch({executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',headless:true});
 const p=await b.newPage({viewport:{width:1440,height:1000},locale:'en-US'});
 await p.goto('http://127.0.0.1:5173/work/isometric-style?lang=en',{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(700);
 await p.screenshot({path:'docs/screenshots/project-isometric.jpg',type:'jpeg',quality:86});
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
