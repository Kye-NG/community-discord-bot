import { Message } from "discord.js";
import axios from 'axios';
import Puppeteer from 'puppeteer';
import { Command } from "../classes/command";
import { CommandOptions } from "../declarations/command-options";
import { CommunityDiscordClient } from "../classes/discord-client";

export default class TikTokCommand extends Command {
    constructor() {
        const options: CommandOptions = {
            name: 'tiktok',
            description: 'Send a tik tok link and it will embed the video for you!',
            ownerOnly: true,
            perms: ['SEND_MESSAGES'],
            regexs: [
                /https?:\/\/www\.tiktok\.com\/@.+\/video\/\d*/gm,
                /https?:\/\/m\.tiktok\.com\/v\/\d*/gm,
                /https?:\/\/vm\.tiktok\.com\/\d*/gm,
                /https:\/\/vt\.tiktok\.com\/\d*/gm
            ]
        };

        super(options);
    }

    async run(message: Message, args: string[]) {
        const loadingEmoji = message?.guild?.emojis.cache.get('1005501506021228685');

        message.react(loadingEmoji || '👍');

        const browser = await Puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36');

        await page.goto(message.content, {'waitUntil': 'load', 'timeout': 1000000});

        const video = await page.$('video');
        const videoSrc = await page.evaluate(video => video?.src, video);

        const cookies = await page.cookies();

        let cookieJar = '';

        for (let i = 0; i < cookies.length; i++) {
            cookieJar += `${cookies[i].name}=${cookies[i].value};`;
        }

        if (videoSrc) {
            const response = await axios.get(videoSrc, { responseType: 'arraybuffer', headers: {
                Connection: 'keep-alive',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36',
                Referer: 'https://www.tiktok.com/',
                cookies: cookieJar
            }});

            const buffer = Buffer.from(response.data, 'binary');
            await message.channel.send({
                content: `${message.author.toString()} requested a tik tok!\n<${message.content}>`,
                files: [{
                    attachment: buffer,
                    name: 'tiktok.mp4'
                }]
            });

            if (message.deletable) {
                message.delete().catch(e => {
                    console.log(e);
                });
            }
        }

        // Make sure we close the browser.
        await browser.close();

        (message.client as CommunityDiscordClient).databaseClient.addOneNumberToValue('tiktoksSent');
    }
}
