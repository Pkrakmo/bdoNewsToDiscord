import fs from 'fs';
import puppeteer from 'puppeteer';
import fetch from 'node-fetch';
import os from 'os';
require('dotenv').config();

async function scrapePage(url: string) {

    const browser = await osChecker();
    const page = await browser.newPage();

    await page.goto(url);


    await page.waitForXPath('//*[@id="wrap"]/div/footer/div[2]/div[2]/div/a/img', {
        visible: true
    });

    const [elNotice] = await page.$x('//*[@id="wrap"]/div/div/article/div[2]/div/div[1]/ul/li[1]/a');
    const noticeElementText = await elNotice.getProperty('innerText');
    const noticeText: string = await noticeElementText!.jsonValue();

    const noticeElementLink = await elNotice.getProperty('href');
    const noticeLink: string = await noticeElementLink!.jsonValue();

    const [elimg] = await page.$x('//*[@id="wrap"]/div/div/article/div[2]/div/div[1]/ul/li[1]/a/p/img');
    const noticeElementImg = await elimg.getProperty('currentSrc');
    const noticeImg: string = await noticeElementImg!.jsonValue();

    sleep(4000).then(() => {
        magicFunction(noticeText, noticeLink, noticeImg);
    });

    sleep(10000).then(() => {
        saveInfoToFile(noticeLink);
    });


    await browser.close();

}

async function magicFunction(noticeText: string, noticeLink: string, noticeImg: string) {

    fs.readFile(`./log/bodNews-data.json`, 'utf8', function read(err, data) {
        if (err) {
            return console.log(err);
        }

        let splitNoticeText = noticeText.split("\n")
        let noticeTextFix = splitNoticeText[0] + " " + splitNoticeText[1]

        let jsonData = JSON.parse(data)
        let jsonUrl = jsonData.url

        if (noticeLink == "") {
            //missing link from scrape
        } else if (jsonUrl == "") {
            //missing link from JSON-file)
        } else if (noticeLink == jsonUrl) {
            //Link already posted)
        } else {
            webhook(noticeTextFix, noticeLink, noticeImg)
        }

    });
}

async function saveInfoToFile(url: string) {


    fs.readFile(`./log/bodNews-data.json`, 'utf8', function read(err, data) {
        if (err) {
            return console.log(err);
        }

        let jsonData = JSON.parse(data)

        jsonData.url = url

        let jsonToJson = JSON.stringify(jsonData)

        fs.writeFile(`./log/bodNews-data.json`, `${jsonToJson}`, function (err) {
            if (err) {
                return console.log(err);
            }
        })

    })
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function osChecker() {

    if (os.type() == "Windows_NT") {
        return puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    } else {
        return puppeteer.launch({
            headless: true,
            executablePath: '/usr/bin/chromium-browser',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }
}

async function webhook(noticeText: string, url: string, imageUrl: string, ) {
    const whurl = process.env.WEBHOOK;
    const msg = {
        "embeds": [{
            "title": `${noticeText}`,
            "description": `${url}`,
            "image": {
                "url": `${imageUrl}`
            },

        }]
    };
    fetch(whurl!, {
        "method": "POST",
        "headers": {
            "content-type": "application/json"
        },
        "body": JSON.stringify(msg)
    });
}

async function initiate() {
    
    fs.mkdir('./log', function (ErrnoException) {
        if (ErrnoException) {
            if (ErrnoException.code == 'EEXIST') {
                console.log('Directory exists already');
            } else {
                console.log('failed to create directory');
                return console.error(ErrnoException);
            }
        } else {

        }
    })

    let data = {
        "url": "placeholder.com"
    }

    let jsonData = JSON.stringify(data)

    fs.writeFile(`./log/bodNews-data.json`, `${jsonData}`, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Nessesery file have been created");
    })


}



function mainRunner() {

    if (process.argv[2] == null) {
        scrapePage('https://www.naeu.playblackdesert.com/en-US/News/Notice?boardType=1')
    } else if (process.argv[2].toLowerCase() == "init") {
        initiate()
    }
}

mainRunner()