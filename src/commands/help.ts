import { EmbedBuilder, Message } from "discord.js";
import { Command } from "../classes/command";
import { CommunityDiscordClient } from "../classes/discord-client";
import { CommandOptions } from "../declarations/command-options";

export default class HelpCommand extends Command {
    constructor() {
        const options: CommandOptions = {
            name: 'help',
            description: 'Sends the help message',
            ownerOnly: false,
            perms: ['SEND_MESSAGES']
        };

        super(options);
    }

    async run(message: Message, args: unknown) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Help')
            .setDescription('This is a help message.')
            .setTimestamp();
        
        let textCommandValue = '';
        let regexCommandValue ='';
        
        const textCommands = [...(message.client as CommunityDiscordClient).commands.values()].filter((command: Command) => !command.regexs || command.regexs.length === 0);
        const regexCommands = [...(message.client as CommunityDiscordClient).commands.values()].filter((command: Command) => command.regexs && command.regexs.length > 0);

        for (const command of textCommands) {
            textCommandValue += `\`${(message.client as CommunityDiscordClient).prefix}${command.name}\` - ${command.description}\n`;
        }

        for (const command of regexCommands) {
            regexCommandValue += `\`${command.name}\` - ${command.description}\n`;
        }

        embed.addFields({ name: 'Text Commands', value: textCommandValue });
        embed.addFields({ name: 'Alternative Commands', value: regexCommandValue });
    
        message.channel.send({ embeds: [embed] });
    }
}