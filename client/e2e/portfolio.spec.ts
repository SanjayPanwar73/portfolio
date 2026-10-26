import { test as base, expect, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const qa = fileURLToPath(new URL('../../.qa/', import.meta.url));
const email = 'panwarsanjay710@gmail.com';
const siteUrl = 'https://portfolio-ten-omega-73.vercel.app';
const test = base.extend<{ runtimeErrors: string[]; localResourceFailures: string[] }>({
  runtimeErrors: [async ({page}, use, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await use(errors);
    await testInfo.attach('browser-errors', {body:JSON.stringify(errors),contentType:'application/json'});
    expect(errors, 'No browser errors').toEqual([]);
  }, {auto:true}],
  localResourceFailures: [async ({page}, use, testInfo) => {
    const failures: string[] = [];
    const local = (url: string) => new URL(url).origin === 'http://127.0.0.1:4173';
    page.on('response', response => {
      if (local(response.url()) && response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
    });
    page.on('requestfailed', request => {
      const reason = request.failure()?.errorText;
      if (local(request.url()) && reason !== 'net::ERR_ABORTED') failures.push(`${reason} ${request.url()}`);
    });
    await use(failures);
    await testInfo.attach('local-resource-failures', {body:JSON.stringify(failures),contentType:'application/json'});
    expect(failures, 'No failed local page, image, font, or script requests').toEqual([]);
  }, {auto:true}],
});

async function openPage(page: Page, route = '/') {
  await page.goto(route, {waitUntil:'networkidle'});
  await page.evaluate(() => document.fonts.ready);
  await expect.poll(() => page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), {message:'Every rendered image loads'}).toBe(true);
}
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
}
async function capture(page: Page, name: string, fullPage = false) {
  await mkdir(qa, {recursive:true});
  await page.screenshot({path:path.join(qa,name),fullPage});
}
async function nav(page: Page, label: string, width: number) {
  await page.getByRole('navigation',{name:width <= 640 ? 'Mobile navigation' : 'Main navigation'}).getByRole('link',{name:label,exact:true}).click();
}

for (const viewport of [{width:1440,height:1000},{width:768,height:1024},{width:641,height:900},{width:640,height:900},{width:375,height:900},{width:320,height:740}]) {
  test.describe(`${viewport.width}px reference design`, () => {
    test.use({viewport});
    test('matches the compact layout and supports navigation, projects, resume and contact', async ({page,context}) => {
      await openPage(page);
      await expect(page.getByRole('heading',{level:1,name:'Sanjay Panwar'})).toBeVisible();
      const portrait = page.getByRole('img',{name:'Sanjay Panwar, full stack developer'});
      expect(await portrait.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBe(354);
      expect(await page.locator('body').evaluate(body => getComputedStyle(body).backgroundColor)).toBe('rgb(16, 15, 15)');
      const main = await page.locator('main').boundingBox();
      expect(main!.width).toBeLessThanOrEqual(768);
      await noOverflow(page);
      await capture(page,`matched-hero-${viewport.width}.png`);
      await capture(page,`matched-full-${viewport.width}.png`,true);

      if (viewport.width <= 640) {
        const dock = page.getByRole('navigation',{name:'Mobile navigation'});
        await expect(dock).toBeVisible();
        await expect(dock.getByRole('link')).toHaveCount(5);
        await expect(dock.getByRole('link',{name:'Home',exact:true})).toHaveAttribute('aria-current','page');
        const bounds = await dock.boundingBox();
        expect(bounds!.x).toBeGreaterThanOrEqual(16);
        expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height - 12);
        for (const link of await dock.getByRole('link').all()) {
          const target = await link.boundingBox();
          expect(target!.width).toBeGreaterThanOrEqual(44);
          expect(target!.height).toBeGreaterThanOrEqual(44);
          expect(await link.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
        }
        await dock.screenshot({path:path.join(qa,`mobile-dock-${viewport.width}.png`)});
      } else {
        await expect(page.getByRole('navigation',{name:'Main navigation'})).toBeVisible();
        await expect(page.locator('.mobile-dock')).toBeHidden();
      }

      const downloadEvent = page.waitForEvent('download');
      await page.getByRole('link',{name:'Resume',exact:true}).click();
      const download = await downloadEvent;
      expect(download.suggestedFilename()).toBe('sanjay_panwar_resume.pdf');
      expect(await download.failure()).toBeNull();
      const stream = await download.createReadStream();
      const chunks: Buffer[] = [];
      for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
      const pdf = Buffer.concat(chunks);
      expect(pdf.subarray(0,5).toString()).toBe('%PDF-');
      expect(pdf.byteLength).toBe(651848);

      await nav(page,'Skills',viewport.width);
      await expect(page).toHaveURL(/\/skills$/);
      await expect(page.getByRole('heading',{level:1,name:'Core Toolkit'})).toBeVisible();
      await expect(page.getByRole('heading',{level:1,name:'Core Toolkit'})).toBeFocused();
      await noOverflow(page);
      await nav(page,'Projects',viewport.width);
      await expect(page).toHaveURL(/\/work$/);
      await expect(page.getByRole('navigation',{name:viewport.width <= 640 ? 'Mobile navigation' : 'Main navigation'}).getByRole('link',{name:'Projects',exact:true})).toHaveAttribute('aria-current','page');
      await expect(page.getByRole('heading',{level:1,name:'Selected Work'})).toBeVisible();
      await expect(page.getByRole('heading',{level:1,name:'Selected Work'})).toBeFocused();
      await expect(page.locator('.project-details')).toHaveCount(4);
      for (const detail of await page.locator('.project-details').all()) {
        await detail.locator('summary').click();
        await expect(detail.getByRole('heading',{name:'An engineering decision'})).toBeVisible();
      }
      await noOverflow(page);
      await nav(page,'Experience',viewport.width);
      await expect(page.getByRole('heading',{level:1,name:'Experience & education'})).toBeVisible();
      await expect(page.getByRole('heading',{level:1,name:'Experience & education'})).toBeFocused();
      await expect(page.getByText('BharatCares (CSRBOX Group)',{exact:true})).toBeVisible();
      await noOverflow(page);
      await nav(page,'About',viewport.width);
      await expect(page.getByRole('heading',{level:1,name:'Sanjay Panwar'})).toBeVisible();
      await expect(page.getByRole('heading',{level:1,name:'Sanjay Panwar'})).toBeFocused();
      await expect(page.getByText('Mandsaur University',{exact:true})).toBeVisible();
      await expect(page.locator('.toolkit-group h3')).toHaveCount(5);
      await noOverflow(page);
      if (viewport.width === 1440) await capture(page,'matched-about-1440.png',true);
      await page.reload({waitUntil:'networkidle'});
      await expect(page.getByRole('heading',{level:1,name:'Sanjay Panwar'})).toBeVisible();
      await nav(page,'Home',viewport.width);
      await page.getByRole('link',{name:'Get in touch',exact:true}).click();
      await expect(page).toHaveURL(/\/#contact$/);
      await expect(page.locator('#contact')).toBeFocused();
      await expect(page.getByRole('textbox',{name:'Name',exact:true})).toBeVisible();
      await expect(page.getByRole('textbox',{name:'Email address',exact:true})).toHaveAttribute('type','email');
      await expect(page.getByRole('button',{name:'Create email draft'})).toBeVisible();
      await expect(page.locator('.email-link')).toHaveAttribute('href',`mailto:${email}`);
      await context.grantPermissions(['clipboard-read','clipboard-write'],{origin:'http://127.0.0.1:4173'});
      await page.getByRole('button',{name:'Copy email',exact:true}).click();
      await expect(page.locator('.copy-status')).toHaveText('Email address copied.');
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(email);
      await noOverflow(page);
      if (viewport.width <= 640) await capture(page,`matched-mobile-contact-${viewport.width}.png`);
    });
  });
}

test('keeps the bottom tabs usable at 320px with keyboard and browser history',async ({page}) => {
  await page.setViewportSize({width:320,height:740});
  await openPage(page);
  const dock = page.getByRole('navigation',{name:'Mobile navigation'});
  await dock.getByRole('link',{name:'Home',exact:true}).focus();
  await page.keyboard.press('Tab');
  await expect(dock.getByRole('link',{name:'Skills',exact:true})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/skills$/);
  await expect(dock.getByRole('link',{name:'Skills',exact:true})).toHaveAttribute('aria-current','page');
  await page.goBack();
  await expect(dock.getByRole('link',{name:'Home',exact:true})).toHaveAttribute('aria-current','page');
  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0,document.body.scrollHeight));
  const lastSocial = await page.locator('.footer-socials > a').last().boundingBox();
  const dockBounds = await dock.boundingBox();
  expect(lastSocial!.y + lastSocial!.height).toBeLessThan(dockBounds!.y);
  await noOverflow(page);
  await capture(page,'matched-mobile-footer-320.png');
});

test('persists the light theme and returns to the dark reference palette',async ({page}) => {
  await openPage(page);
  await page.getByRole('button',{name:'Switch to light theme'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await expect(page.locator('body')).toHaveCSS('background-color','rgb(250, 250, 250)');
  await page.reload({waitUntil:'networkidle'});
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content','#fafafa');
  await capture(page,'matched-light-1440.png');
  await page.setViewportSize({width:375,height:900});
  const dock = page.getByRole('navigation',{name:'Mobile navigation'});
  await expect(dock).toHaveCSS('background-color','rgb(250, 250, 250)');
  await page.getByRole('button',{name:'Switch to dark theme'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content','#100f0f');
  await expect(dock).toHaveCSS('background-color','rgb(25, 24, 24)');
  await expect(dock.getByRole('link',{name:'Home',exact:true})).toHaveCSS('color','rgb(117, 179, 255)');
});

test('serves every direct page with route metadata after reload and recovers from an unknown URL', async ({page}) => {
  const pages = [
    {path:'/',heading:'Sanjay Panwar',title:'Home'},
    {path:'/skills',heading:'Core Toolkit',title:'Toolkit'},
    {path:'/work',heading:'Selected Work',title:'Projects'},
    {path:'/experience',heading:'Experience & education',title:'Experience'},
    {path:'/about',heading:'Sanjay Panwar',title:'About'},
    {path:'/missing-page',heading:'Page not found',title:'Page not found'},
  ];
  for (const route of pages) {
    await openPage(page,route.path);
    for (const reload of [false,true]) {
      if (reload) await page.reload({waitUntil:'networkidle'});
      await expect(page.getByRole('heading',{level:1,name:route.heading,exact:true})).toBeVisible();
      await expect(page).toHaveTitle(`Sanjay Panwar | ${route.title}`);
      const canonical = `${siteUrl}${route.path}`;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',canonical);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content',canonical);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content',/Sanjay Panwar/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',/final-year B\.Tech CSE \(AI\) student/i);
      await noOverflow(page);
    }
  }
  await page.getByRole('link',{name:'Back to home'}).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading',{level:1,name:'Sanjay Panwar'})).toBeFocused();
});

test('serves real local portrait, social image, favicon, crawler metadata and structured profile data', async ({page,request}) => {
  await openPage(page);
  const socialUrl = await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(socialUrl).toBe(`${siteUrl}/assets/social-preview.png`);
  const social = await request.get(new URL(socialUrl!).pathname);
  expect(social.ok()).toBe(true);
  expect(social.headers()['content-type']).toContain('image/png');
  const png = await social.body();
  expect(png.subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(630);
  const portrait = await request.get('/assets/sanjay-panwar.webp');
  expect(portrait.ok()).toBe(true);
  expect((await portrait.body()).subarray(8,12).toString()).toBe('WEBP');
  const faviconUrl = await page.locator('link[rel="icon"]').getAttribute('href');
  const favicon = await request.get(faviconUrl!);
  expect(favicon.ok()).toBe(true);
  expect(favicon.headers()['content-type']).toContain('image/svg+xml');
  expect(await favicon.text()).toContain('<svg');
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain(`${siteUrl}/sitemap.xml`);
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  for (const route of ['/','/about','/work','/skills','/experience']) expect(xml).toContain(`<loc>${siteUrl}${route}</loc>`);
  const structuredProfile = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(structuredProfile.name).toBe('Sanjay Panwar');
  expect(structuredProfile.email).toBe(`mailto:${email}`);
  expect(structuredProfile.sameAs).toContain('https://github.com/SanjayPanwar73');
});

test('uses native required, email and length validation without requesting an invalid email draft', async ({page}) => {
  await openPage(page,'/#contact');
  const name = page.getByRole('textbox',{name:'Name',exact:true});
  const address = page.getByRole('textbox',{name:'Email address',exact:true});
  const message = page.getByRole('textbox',{name:'Your message',exact:true});
  const submit = page.getByRole('button',{name:'Create email draft'});
  await submit.click();
  await expect(name).toBeFocused();
  expect(await name.evaluate(input => (input as HTMLInputElement).validity.valueMissing)).toBe(true);
  await name.fill('A');
  await address.fill('aditi@example.com');
  await message.fill('A complete internship enquiry.');
  await submit.click();
  await expect(name).toBeFocused();
  expect(await name.evaluate(input => (input as HTMLInputElement).validity.tooShort)).toBe(true);
  await name.fill('Aditi');
  await address.fill('invalid-email');
  await submit.click();
  await expect(address).toBeFocused();
  expect(await address.evaluate(input => (input as HTMLInputElement).validity.typeMismatch)).toBe(true);
  await address.fill('aditi@example.com');
  await message.fill('Too short');
  await submit.click();
  await expect(message).toBeFocused();
  expect(await message.evaluate(input => (input as HTMLTextAreaElement).validity.tooShort)).toBe(true);
  for (const [field,limit] of [[name,80],[address,254],[message,5000]] as const) {
    await field.fill('X'.repeat(limit + 1));
    expect((await field.inputValue()).length).toBe(limit);
  }
  await expect(page.locator('.draft-status')).toHaveCount(0);
  await expect(page).toHaveURL('/#contact');
});

test('keeps browser new-tab behavior for modified internal links and supports the skip link', async ({page,context}) => {
  await openPage(page);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.goto('/');
  const newTab = context.waitForEvent('page');
  await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Projects',exact:true}).click({modifiers:['ControlOrMeta']});
  const projectTab = await newTab;
  await expect(projectTab).toHaveURL(/\/work$/);
  await expect(projectTab.getByRole('heading',{level:1,name:'Selected Work'})).toBeVisible();
  await expect(page).toHaveURL('/');
  await projectTab.close();
});

test('keeps project cards static when the visitor requests reduced motion', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await openPage(page,'/work');
  const card = page.locator('.project-card').first();
  const before = await card.boundingBox();
  await card.hover();
  await expect.poll(() => card.evaluate(element => getComputedStyle(element).transform)).toBe('none');
  const after = await card.boundingBox();
  expect(after!.y).toBe(before!.y);
  expect(await page.locator('html').evaluate(element => getComputedStyle(element).scrollBehavior)).toBe('auto');
  await card.locator('summary').click();
  await expect(card.getByRole('heading',{level:3,name:'An engineering decision'})).toBeVisible();
});
