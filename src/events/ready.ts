import { ChannelType } from "discord.js";
import { CommunityDiscordClient } from "../classes/discord-client";

export async function handleReadyEvent(client: CommunityDiscordClient) {
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
}