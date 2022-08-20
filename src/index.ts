import { Client, ChannelType } from 'discord.js';
import Puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

// Create a new client instance. Intents field allows all permissions to bot for now.
const client = new Client({ intents: 131071 });

const discordBotToken = process.env.DISCORD_BOT_TOKEN;
const discordBotPrefix = process.env.DISCORD_BOT_PREFIX;

// Tik tok Regexs
const tiktokRegex: RegExp = /https?:\/\/www\.tiktok\.com\/@.+\/video\/\d*/gm;
const tiktokMobileRegex: RegExp = /https?:\/\/m\.tiktok\.com\/v\/\d*/gm;
const tiktokMobileAltRegex: RegExp = /https?:\/\/vm\.tiktok\.com\/\d*/gm;
const tikTokOtherRegex: RegExp = /https:\/\/vt\.tiktok\.com\/\d*/gm;

process.on('uncaughtException', err => {
    console.error('There was an uncaught error', err);
    process.exit(1);
});

// When the client is ready, run this code (only once)
client.once('ready', async() => {
	console.log('Ready!');

    // Show in a bot channel that the bot is online.
    if (process.env.ENVIRONMENT === 'production') {
        const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID || '');
        const channel = await guild.channels.fetch(process.env.DISCORD_CHANNEL_ID || '');

        // Type script requires me to type check the channel otherwise .send() won't be available.
        if (channel && channel.type === ChannelType.GuildText) {
            await channel.send('Bot is ready!');
        }
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) { return; }

    const args = message.content.split(" ").slice(1);

    if (message.content === `${discordBotPrefix}ping`) {
        message.channel.send('Pong!');
    } else if (message.content === 'discord') {
        message.channel.send('sucks');
    } else if (message.content.toLowerCase().includes('tighe')) {
        const tigheEmoji = message?.guild?.emojis.cache.get('1005059113027391548');

        message.react(tigheEmoji || '👍');
    } else if (message.content.startsWith(`${discordBotPrefix}eval`)) {
        // If the author isn't wade or kye, do nothing.
        if (message.author.id !== '189696688657530880' && message.author.id !== '118881356791939074') { return; }
    
        try {
          // Evaluate (execute) our input
          const evaled = eval(args.join(" "));
    
          // Put our eval result through the function
          // we defined above
          const cleaned = await clean(evaled, client);
    
          // Reply in the channel with our result
          message.channel.send(`\`\`\`js\n${cleaned}\n\`\`\``);
        } catch (err) {
          // Reply in the channel with our error
          message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
        }
    
        // End of our command
      }

    else if ((
        tiktokRegex.test(message.content) ||
        tiktokMobileRegex.test(message.content) ||
        tiktokMobileAltRegex.test(message.content) ||
        tikTokOtherRegex.test(message.content)
    )) {
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

        // Make sure we close the browser.
        await browser.close();

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

            message.delete();
        }
    }
});

// Login to Discord with your client's token
client.login(discordBotToken);

// functions

const clean = async (text: string, client: Client) => {
    // If our input is a promise, await it before continuing
    if (text && text.constructor.name == "Promise")
      text = await text;
    
    if (typeof text !== "string")
      text = require("util").inspect(text, { depth: 1 });
    
    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));

    text = text.replaceAll((client.token as string), '[REDACTED]');
    
    return text;
}