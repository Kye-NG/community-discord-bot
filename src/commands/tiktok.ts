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

    const reaction = message.react(loadingEmoji || '👍');

    try {
      const browser = await Puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();

      page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36');

      await page.goto(message.content, { 'waitUntil': 'load', 'timeout': 1000000 });

      const video = await page.$('video');
      const videoSrc = await page.evaluate(video => video?.src, video);

      console.log(videoSrc);
      console.log(video);

      if (!videoSrc || !video) {
        throw new Error('Video not found');
      }

      const cookies = await page.cookies();

      let cookieJar = '';

      for (let i = 0; i < cookies.length; i++) {
        cookieJar += `${cookies[i].name}=${cookies[i].value};`;
      }

      if (videoSrc) {
        const response = await axios.get(videoSrc, {
          responseType: 'arraybuffer', headers: {
            Connection: 'keep-alive',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36',
            Referer: 'https://www.tiktok.com/',
            cookies: cookieJar
          }
        })

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
    } catch (e) {
      console.log((e as any).message);
      const errorText = (e as any).message;
      (await reaction).remove();

      if (errorText && errorText.includes('Video not found')) {
        const mobileOnlyEmoji = message?.guild?.emojis.cache.get('1048768016931881050');

        message.react(mobileOnlyEmoji || '📱');

        await sendErrorMessageThenDelete(message, 5000, 'This tik tok cannot be embedded, it\'s only available on mobile! Self destructing in 5 seconds...');
    } else {
        const checkEngineEmoji = message?.guild?.emojis.cache.get('1007137550298792048');
        message.react(checkEngineEmoji || '🛑');

        await sendErrorMessageThenDelete(message, 5000, 'Something went wrong, please try again later. <@189696688657530880>\n\nThis message will self destruct in 5 seconds.');
      }
    }
  }
}

async function sendErrorMessageThenDelete(message: Message, timeout: number, content: string) {
    const errorMessage = await message.channel.send(content);

    setTimeout(() => {
        errorMessage.delete();
    }, timeout);
}
