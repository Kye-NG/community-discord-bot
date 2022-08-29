import { Message } from "discord.js";
import { Command } from "../../classes/command";
import { CommandOptions } from "../../declarations/command-options";

export default class OliviaCommand extends Command {
    constructor() {
        const options: CommandOptions = {
            name: 'olivia',
            description: 'If the message says olivia or beast you get a react. ;)',
            ownerOnly: true,
            perms: ['SEND_MESSAGES'],
            regexs: [
                /olivia/gi,
                /beast/gi,
                /sexy/gi,
                /liv/gi
            ]
        };

        super(options);
    }

    async run(message: Message, args: string[]) {
        const oliviaEmoji = message?.guild?.emojis.cache.get('1013631909336723587');

        message.react(oliviaEmoji || '👍');
    }
}
