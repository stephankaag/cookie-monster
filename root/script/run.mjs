import { chromium } from 'playwright';
import waitPort from "wait-port"
import { writeFileSync } from 'fs';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms * 1000));

const TIME_TO_WAIT = 10;

async function run() {
  console.debug(`Give page ${TIME_TO_WAIT}sec to load before connecting...`);
  await delay(TIME_TO_WAIT);
  console.debug('Continuing...');

  let browser, context, page;

  const cleanup = async () => {
    if (page) {
      try {
        await page.close();
      } catch { }
    }
    if (context) {
      try {
        await context.close();
      } catch { }
    }
    if (browser) {
      try {
        await browser.close();
      } catch { }
    }
  }

  const requests = [];

  const { open } = await waitPort({
    host: '127.0.0.1',
    port: 9222,
    timeout: 1000
  });

  if (!open) {
    throw ("Browser not available");
  }

  try {
    browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    context = browser.contexts()[0];

    page = await context.newPage();

    page.on('request', (request) => {
      if (['xhr', 'fetch'].includes(request.resourceType())) {
        requests.push(request);
      }
    });

    const response = await page.goto(process.env['URL'], {
      timeout: TIME_TO_WAIT * 1000,
    }).catch((e) => {
      console.warn(e);
    });

    if (response) {
      requests.push(response.request());
    }

    const value = (await Promise.all(requests.map(async (request) => {
      const response = await request.response();

      let data = [];
      if (response && (await response.headerValue('content-type'))?.startsWith('application/json')) {
        try {
          data = await response.json()
        } catch (e) {
          console.warn(`${request.url()} returned invalid JSON`)
        }
      }

      if (Object.entries(data).length) {
        return {
          url: request.url(),
          method: request.method(),
          postData: request.postData(),
          headers: await request.allHeaders(),
          cookies: await context.cookies(request.url())
        }
      }
    }))).filter((x) => !!x);

    if (process.env.DEBUG) {
      console.debug(JSON.stringify(value))
    }

    writeFileSync('/tmp/result.json', JSON.stringify(value, null, 2));

    await cleanup()
  } catch (error) {
    await cleanup()
    throw (error);
  }
};

await run()
