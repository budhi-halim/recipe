import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright-core';
function findChrome(){
 for(const p of [process.env.CHROME_PATH,'/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'])if(p&&existsSync(p))return p;
 for(const name of ['google-chrome','google-chrome-stable','chromium'])try{return execFileSync('which',[name],{encoding:'utf8'}).trim();}catch{}
 throw Error('No Chrome/Chromium binary found on the GitHub Actions runner');
}
const browser=await chromium.launch({headless:true,executablePath:findChrome(),args:['--no-sandbox']});
const errors=[];
try{
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8765/#/',{waitUntil:'networkidle'});
 await page.locator('.collection-card').waitFor();
 assert.equal(await page.locator('#cards .recipe-card').count(),5,'Main catalogue must show one Sushi collection and four old recipes');
 assert.equal(await page.locator('#cards .collection-card').count(),1);
 await page.locator('.collection-card').click();
 await page.locator('#sushi-cards .recipe-card').first().waitFor();
 assert.ok(page.url().endsWith('/#/sushi'));
 assert.equal(await page.locator('#foundation-cards .recipe-card').count(),2,'Sushi rice and sauce must be separate essentials');
 assert.equal(await page.locator('#sushi-cards .recipe-card').count(),34,'All 34 sushi variations should appear');
 await page.locator('#sushi-filters button',{hasText:'Nigiri'}).click();
 const nigiriCount=await page.locator('#sushi-cards .recipe-card').count();
 assert.ok(nigiriCount>0&&nigiriCount<34,'Nigiri filter must actually narrow results');
 await page.locator('#sushi-filters button',{hasText:'All'}).click();
 assert.equal(await page.locator('#sushi-cards .recipe-card').count(),34);
 await page.locator('#sushi-query').fill('miso');
 const misoCount=await page.locator('#sushi-cards .recipe-card').count();
 assert.ok(misoCount>0&&misoCount<34,'Search must actually filter');
 await page.locator('#sushi-query').fill('');
 assert.equal(await page.locator('#sushi-cards .recipe-card').count(),34);
 await page.locator('#foundation-cards a[href="#/recipe/sushi-rice"]').click();
 await page.locator('#quantity').waitFor();
 assert.ok(page.url().includes('#/recipe/sushi-rice'));
 assert.equal(await page.locator('#hero-serving').textContent(),'6 servings');
 await page.locator('#quantity').fill('12');
 assert.equal(await page.locator('#hero-serving').textContent(),'12 servings');
 await page.locator('.breadcrumbs a[href="#/sushi"]').click();
 await page.locator('#sushi-cards .recipe-card').first().waitFor();
 const mobile=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 mobile.on('pageerror',e=>errors.push(e.message));
 await mobile.goto('http://127.0.0.1:8765/#/sushi',{waitUntil:'networkidle'});
 assert.equal(await mobile.locator('#sushi-cards .recipe-card').count(),34,'Mobile catalogue should show all sushi recipes');
 await mobile.locator('#sushi-cards .recipe-card').first().click();
 assert.ok(mobile.url().includes('#/recipe/'));
 await mobile.locator('.breadcrumbs a[href="#/sushi"]').waitFor({state:'visible',timeout:15000});
 assert.deepEqual(errors,[],'No browser JavaScript errors should occur');
 console.log(JSON.stringify({ok:true,total:40,mainTiles:5,sushiCards:34,essentials:2,nigiriCount,misoCount,mobile:true}));
}finally{await browser.close();}
