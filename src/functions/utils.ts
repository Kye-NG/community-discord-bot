import { ChannelType, NonThreadGuildBasedChannel } from "discord.js";

export async function ensureGuildChannelAndSend(channel: NonThreadGuildBasedChannel | null, text: string) {
    if (channel && channel.type === ChannelType.GuildText) {
        await channel.send(text);
    }
}