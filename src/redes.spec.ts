import { Page, firefox } from "@playwright/test";
import { createObjectCsvWriter } from 'csv-writer';

const TWO_MINUTES = 2*60*1000;

export async function getNetworkStats () {
    const browser = await firefox.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://beta.simet.nic.br/');

    // Await measure http call to conclude
    await page.waitForResponse('https://api.simet.nic.br/collector/measure', { timeout: TWO_MINUTES });

    const downloadValue = await getValueFromHTMLElement(page, '.text-md-left > div:nth-child(2) > span:nth-child(2)');
    const uploadValue = await getValueFromHTMLElement(page, '.text-md-right > div:nth-child(2) > span:nth-child(2)');
    const pingValue = await getValueWithoutUnitFromHTMLElement(page, 'div.col-md-4:nth-child(1) > div:nth-child(1) > div:nth-child(1) > p:nth-child(2) > span:nth-child(1)', ' ms');
    const jitterValue = await getValueWithoutUnitFromHTMLElement(page, 'div.col-md-4:nth-child(2) > div:nth-child(1) > div:nth-child(1) > p:nth-child(2) > span:nth-child(1)', ' ms');
    const lostValue = await getValueWithoutUnitFromHTMLElement(page, 'div.col-12:nth-child(3) > div:nth-child(1) > div:nth-child(1) > p:nth-child(2) > span:nth-child(1)', ' %');

    const csvWriter = createObjectCsvWriter({
        path: 'number.csv',
        header: [
            { id: 'download', title: 'Download' },
            { id: 'upload', title: 'Upload' },
            { id: 'ping', title: 'Ping' },
            { id: 'jitter', title: 'Jitter' },
            { id: 'lost', title: 'Lost'},
            { id: 'date', title: 'Date' },
        ],
        append: true,
    });

    const records = [
        { 
            download: downloadValue,
            upload: uploadValue,
            ping: pingValue,
            jitter: jitterValue,
            lost: lostValue,
            date: new Date().toISOString(),
        },
    ];

    await csvWriter.writeRecords(records);
}

async function getValueFromHTMLElement(page: Page, selector: string) {
    const htmlEl = await page.$(selector);
    const value = Number(await htmlEl?.textContent() ?? '-1'); ;
    return value;
}

async function getValueWithoutUnitFromHTMLElement(page: Page, selector: string, unit: string) {
    const htmlEl = await page.$(selector);
    const value = Number((await htmlEl?.textContent())?.replace(unit, '') ?? '-1');
    return value;
}
