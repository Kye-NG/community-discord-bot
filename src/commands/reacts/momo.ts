import { Message } from "discord.js";
import { Command } from "../../classes/command";
import { CommandOptions } from "../../declarations/command-options";

export default class MomoCommand extends Command {
    constructor() {
        const options: CommandOptions = {
            name: 'momo',
            description: 'If the message says momo or caleb you get a react. ;)',
            ownerOnly: true,
            perms: ['SEND_MESSAGES'],
            regexs: [
                /momo/gi,
                /caleb/gi
            ]
        };

        super(options);
    }

    async run(message: Message, args: string[]) {
        const momoEmoji = message?.guild?.emojis.cache.get('1005026384860696577');

        message.react(momoEmoji || '👍');
    }
}
