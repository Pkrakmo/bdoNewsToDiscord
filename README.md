# bdoNewsToDiscord
Script that will get the newest notice from https://www.naeu.playblackdesert.com/en-US/News/Notice?boardType=1 and post it to Discord via their Webhook

I avoided getting news from "Show All" as they sometimes posts 8 posts at the same time

I have tested this on Windows 10 and Raspberry Pi OS

## Screenshot

![Screenshot](https://i.imgur.com/XXA3iTy.png)

# Setup / Running

## Installation guide

* you must have node installed to run this program locally.
* You will also need other packages. To install these, run this command:

```sh
npm install
```

## env

> You will need a .env file to run this locally. Discord webhook URL: [How to generate a discord webhook url](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)

ENV variables needed
  
| Name | Data needed |
| ------ | ------ |
| WEBHOOK | Discord webhook url|

## Compile

* To run this scrip you need to compile the the typescript files into usable javascript files

```sh
tsc
```

## Setup
  
To create the nessesary file and folder, please run the following command, otherwise it will not work 

```sh
node .\dist\app.js init
```

## Running

```sh
node .\dist\app.js
```

## Making it work on a Raspberry Pi

* this script uses puppeteer that needs chromeium installed, but it needs to be installed manually on Raspberry Pi OS: [Source: Puppeteer on Raspberry Pi OS NodeJS](https://samiprogramming.medium.com/puppeteer-on-raspbian-nodejs-3425ccea470e)

```sh
sudo apt install chromium-browser chromium-codecs-ffmpeg
```

* Since I am a total n00b I do not use complete paths, so this will cause issues trying to run it on RPi, but using bash-files are the workaround for now

```bash
#!/bin/bash
cd /home/pi/projects/bdoNewsToDiscord/
node dist/app.js
```