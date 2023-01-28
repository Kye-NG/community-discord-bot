import { GuildMember } from "discord.js";
import { CommunityDiscordClient } from "../classes/discord-client";

export async function handleGuildMemberAdd(member: GuildMember, client: CommunityDiscordClient) {
  const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID || '');
  const beanSproutRole = await guild.roles.fetch('1005049567571619901');

  if (beanSproutRole) {
      await member.roles.add(beanSproutRole);
  }
}