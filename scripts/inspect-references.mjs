import {chromium} from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch({channel:'chrome'});
const results=[];
for(const [name,url] of [['mankirat','https://mankiratsingh.com/'],['abhinav','https://abhinavkumarsingh.tech/'],['vennictus','https://portfolio-vennictus.vercel.app/projects']]){
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 try{const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:20000});await page.screenshot({path:`artifacts/reference-${name}-desktop.png`,timeout:10000});const desktop=await page.evaluate(()=>({title:document.title,font:getComputedStyle(document.body).fontFamily,background:getComputedStyle(document.body).backgroundColor,headings:[...document.querySelectorAll('h1,h2')].slice(0,10).map(e=>e.textContent),overflow:document.documentElement.scrollWidth>innerWidth}));await page.setViewportSize({width:390,height:844});await page.screenshot({path:`artifacts/reference-${name}-mobile.png`,timeout:10000});results.push({url,status:response.status(),desktop,mobileOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});}catch(error){results.push({url,error:String(error)});}await page.close();
}
fs.writeFileSync('artifacts/reference-inspection.json',JSON.stringify(results,null,2));await browser.close();
