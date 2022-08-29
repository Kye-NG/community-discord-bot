import { Message } from "discord.js";
import { Command } from "../classes/command";
import { CommandOptions } from "../declarations/command-options";

export default class NetteCommand extends Command {
    constructor() {
        const options: CommandOptions = {
            name: 'nette',
            description: 'If the message says nette or smolsquish you get a react. ;)',
            ownerOnly: true,
            perms: ['SEND_MESSAGES'],
            regexs: [
                /smolsquish/gi,
                /nette/gi
            ]
        };

        super(options);
    }

    async run(message: Message, args: string[]) {
        const netteEmoji = message?.guild?.emojis.cache.get('1005464436175290379');

        message.react(netteEmoji || '👍');
    }
}
