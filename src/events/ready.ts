import { CommunityDiscordClient } from "../classes/discord-client";
import { ensureGuildChannelAndSend } from "../functions/utils";

export async function handleReadyEvent(client: CommunityDiscordClient) {
    // Show in a bot channel that the bot is online.
    const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID || '');
    const channel = await guild.channels.fetch(process.env.DISCORD_CHANNEL_ID || '');

    const readyText = process.env.ENVIRONMENT === 'production' ?
        '[Prod] Bot is online!' :
        '[Dev] Bot is online!';

    await ensureGuildChannelAndSend(channel, readyText);

    await client.databaseClient.initialize().catch(async(err) => {
        await ensureGuildChannelAndSend(channel, 'Error initializing database: ' + err);

        throw err;
    });

    const dbText = process.env.ENVIRONMENT === 'production' ?
        '[Prod] Database initialised!' :
        '[Dev] Database initialised!';

    await ensureGuildChannelAndSend(channel, dbText);

    const restartAmount = await client.databaseClient.addOneNumberToValue('clientRestarts');

    const restartText = process.env.ENVIRONMENT === 'production' ?
        `[Prod] Bot has restarted ${restartAmount + 1} times!` :
        `[Dev] Bot has restarted ${restartAmount + 1} times!`;

    await ensureGuildChannelAndSend(channel, restartText);
}