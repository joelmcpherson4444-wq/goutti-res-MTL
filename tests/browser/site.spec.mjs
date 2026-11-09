import { test, expect } from '@playwright/test';
const paths=['/','/installation-de-gouttieres/','/descentes-pluviales/','/secteurs/','/reparer-ou-remplacer-ses-gouttieres/','/soumission/'];
test('pages, navigation, metadata and local links', async ({page, request}) => {
 const titles=new Set();
 for (const path of paths) {
  const response=await page.goto(path); expect(response.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang','fr-CA');
  await expect(page.locator('h1')).toHaveCount(1);
  titles.add(await page.title());
  await expect(page.locator('meta[name=description]')).toHaveAttribute('content',/.{40,}/);
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content','noindex, nofollow');
  expect(await page.locator('a[href^="tel:"]').count()).toBe(0);
  const hrefs=await page.locator('a[href^="/"]').evaluateAll(xs=>[...new Set(xs.map(a=>a.getAttribute('href')))]);
  for (const href of hrefs) expect((await request.get(href)).status()).toBe(200);
 }
 expect(titles.size).toBe(6);
 expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /');
 expect(await (await request.get('/sitemap.xml')).text()).not.toContain('<loc>');
});
test('keyboard services menu, skip link and fictitious call dialog', async ({page}) => {
 await page.goto('/');
 await page.keyboard.press('Tab'); await expect(page.locator('.skip')).toBeFocused();
 await page.keyboard.press('Enter'); expect(new URL(page.url()).hash).toBe('#contenu');
 await page.locator('.services-menu summary').focus(); await page.keyboard.press('Enter');
 await expect(page.locator('.services-menu')).toHaveAttribute('open','');
 await page.keyboard.press('Tab'); await expect(page.locator('.services-menu a').first()).toBeFocused();
 await page.locator('.hero [data-call]').click(); await expect(page.getByRole('dialog')).toBeVisible();
 await expect(page.getByRole('dialog')).toContainText('fictif');
 await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).not.toBeVisible();
 expect(await page.evaluate(()=>window.dataLayer||[])).toEqual([]);
});
test('form validation and simulated success transmit nothing', async ({page}) => {
 let posts=0; page.on('request',req=>{if(req.method()==='POST') posts++});
 await page.goto('/soumission/');
 await page.getByRole('button',{name:'Simuler la demande'}).click();
 await expect(page.locator('#name')).toBeFocused();
 await page.locator('#name').fill('Test Exemple'); await page.locator('#phone').fill('12');
 await page.locator('#postal').fill('H2H 2H2'); await page.locator('#project').selectOption({label:'Installation de gouttières'});
 await page.getByRole('button',{name:'Simuler la demande'}).click();
 await expect(page.locator('#phone')).toBeFocused();
 await page.locator('#phone').fill('514 555-0148');
 await page.locator('#postal').fill('000000'); await page.getByRole('button',{name:'Simuler la demande'}).click();
 await expect(page.locator('#postal')).toBeFocused();
 await page.locator('#postal').fill('H2H 2H2'); await page.getByRole('button',{name:'Simuler la demande'}).click();
 await expect(page.locator('#form-status')).toContainText('Simulation réussie');
 expect(posts).toBe(0); expect(await page.evaluate(()=>window.dataLayer||[])).toEqual([]);
});
for (const [name,width,height] of [['mobile',390,844],['desktop',1440,1000]]) {
 test(`layout and screenshot ${name}`,async({page})=>{
  await page.setViewportSize({width,height}); await page.goto('/');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`docs/accueil-${name}.png`,fullPage:true});
  if(name==='mobile') {
   await expect(page.locator('.mobile-actions')).toBeVisible();
   await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
   const footer=await page.locator('.footer-bottom').boundingBox(); const bar=await page.locator('.mobile-actions').boundingBox();
   expect(footer.y+footer.height).toBeLessThanOrEqual(bar.y);
  }
 });
}
test('real submission requires a successful confirmed response',async({page})=>{
 await page.goto('/soumission/');
 await page.evaluate(()=>{document.body.dataset.realQuotes='true';document.body.dataset.endpoint='https://form.test/quote'});
 await page.locator('#name').fill('Test Exemple'); await page.locator('#phone').fill('5145550148');
 await page.locator('#postal').fill('H2H 2H2'); await page.locator('#project').selectOption({label:'Installation de gouttières'});
 let result={success:false}; let status=500;
 await page.route('https://form.test/quote',route=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(result)}));
 await page.getByRole('button',{name:'Simuler la demande'}).click();
 await expect(page.locator('#form-status')).toContainText('n’a pas pu être confirmée');
 expect(await page.evaluate(()=>window.dataLayer||[])).toEqual([]);
 status=200; await page.getByRole('button',{name:'Simuler la demande'}).click();
 await expect(page.locator('#form-status')).toContainText('n’a pas pu être confirmée');
 expect(await page.evaluate(()=>window.dataLayer||[])).toEqual([]);
 result={success:true}; await page.getByRole('button',{name:'Simuler la demande'}).click();
 await expect(page.locator('#form-status')).toContainText('bien été transmise');
 expect(await page.evaluate(()=>window.dataLayer)).toEqual([{event:'quote_submit_success',page_path:'/soumission/'}]);
 await expect(page.locator('#name')).toHaveValue('');
});
test('all pages fit a narrow phone',async({page})=>{
 await page.setViewportSize({width:320,height:740});
 for(const path of paths){await page.goto(path);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
});
test('without JavaScript the form cannot transmit personal data',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 await page.goto('http://127.0.0.1:4321/soumission/');
 await expect(page.getByRole('button',{name:'Simuler la demande'})).toBeDisabled();
 await expect(page.locator('#quote-form')).toHaveAttribute('method','dialog');
 await context.close();
});
