import { Client, ChannelType } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

// Create a new client instance
const client = new Client({ intents: 131071 });

const discordBotToken = process.env.DISCORD_BOT_TOKEN;
const discordBotPrefix = process.env.DISCORD_BOT_PREFIX;

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

    if (message.content === `${discordBotPrefix}ping`) {
        message.channel.send('Pong!');
    } else if (message.content === 'discord') {
        message.channel.send('sucks');
    } else if (message.content.includes('tighe')) {
        message.channel.send('tighe is hot');
    }
});

// Login to Discord with your client's token
client.login(discordBotToken);
