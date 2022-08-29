import { Message } from "discord.js";
import { Command } from "../../classes/command";
import { CommandOptions } from "../../declarations/command-options";

export default class DanielCommand extends Command {
    constructor() {
        const options: CommandOptions = {
            name: 'daniel',
            description: 'If the message says daniel or runo you get a react. ;)',
            ownerOnly: true,
            perms: ['SEND_MESSAGES'],
            regexs: [
                /daniel/gi,
                /yuno/gi
            ]
        };

        super(options);
    }

    async run(message: Message, args: string[]) {
        const danielEmoji = message?.guild?.emojis.cache.get('991857275142672434');

        message.react(danielEmoji || '👍');
    }
}
