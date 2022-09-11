import { CommunityDiscordClientOptions } from './declarations/community-discord-client-options';
import { CommunityDiscordClient } from './classes/discord-client';
import { handleMessageEvent } from './events/message';
import { handleReadyEvent } from './events/ready';
import dotenv from 'dotenv';
import { Database } from './classes/database';
import { resolve } from 'path';

// Inject ENV variables into process.env
dotenv.config();

// ENV Variables
const discordBotToken = process.env.DISCORD_BOT_TOKEN;
const discordBotPrefix = process.env.DISCORD_BOT_PREFIX;
const { KYE_DISCORD_ID, WADE_DISCORD_ID } = process.env;

const databaseClient = new Database(resolve(__dirname, '..', 'bin', process.env.DATABASE_NAME || 'database.json'));

const options: CommunityDiscordClientOptions = {
    owners: [KYE_DISCORD_ID, WADE_DISCORD_ID],
    prefix: discordBotPrefix || '!',
    commandDirectory: './commands',
    debug: process.env.ENVIRONMENT !== 'production',
    databaseClient
};

// Create a new client instance. Intents field allows all permissions to bot for now.
const client = new CommunityDiscordClient({ intents: 131071 }, options);

// When the client is ready, run this code (only once)
client.once('ready', async() => {
    handleReadyEvent(client);
});

client.on('messageCreate', async message => {
    handleMessageEvent(message, client);
});

// Login to Discord with your client's token
client.startup(discordBotToken || '');
