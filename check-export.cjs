const { chromium } = require('playwright-core');
(async()=>{
 const b=await chromium.launch({executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',headless:true});
 for (const url of ['http://127.0.0.1:5173/cv?lang=en','http://127.0.0.1:5173/cv?lang=en&export=pdf']) {
  const p=await b.newPage({viewport:{width:1440,height:1000},locale:'en-US'});
  await p.goto(url,{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);
  console.log(url, await p.evaluate(()=>({anchors:document.querySelectorAll('.cv-work-list a').length,divs:document.querySelectorAll('.cv-work-list > div').length,query:location.search})));
  await p.close();
 }
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
