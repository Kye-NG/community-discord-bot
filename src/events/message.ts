import { Message } from "discord.js";
import { Command } from "../classes/command";
import { CommunityDiscordClient } from "../classes/discord-client";

export async function handleMessageEvent(message: Message, client: CommunityDiscordClient) {
    if (message.author.bot) return;

    if (message.content.startsWith(client.prefix)) {
        let args = message.content.slice(client.prefix.length).split(/ +/);
        // @ts-ignore
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);

        if (!!command.regexs && command.regexs.length > 0) { return; } 

        if (command.ownerOnly && !(message.author.id === '189696688657530880' || message.author.id === '118881356791939074')) {
            return message.channel.send(`You do not have permission to use this command.`);
        }

        if (command.perms.length > 0 && !message.member?.permissions.has(command.perms)) {
            return message.channel.send(`You do not have permission to use this command.`);
        }

        await command.run(message, args);
    } else {
        const regexCommands = [...client.commands.values()].filter((command: Command) => command.regexs && command.regexs.length > 0);

        let args = message.content.slice(client.prefix.length).split(/ +/);

        regexCommands.forEach((regexCommand: Command) => {
            regexCommand.regexs.forEach((regex: RegExp) => {
                if (regex.test(message.content)) {
                    return regexCommand.run(message, args);
                }
            });
        });
    }
}