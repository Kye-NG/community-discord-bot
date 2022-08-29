import { Message } from "discord.js";
import { Command } from "../../classes/command";
import { CommandOptions } from "../../declarations/command-options";

export default class WadeCommand extends Command {
    constructor() {
        const options: CommandOptions = {
            name: 'wade',
            description: 'If the message says wade you get a react. ;)',
            ownerOnly: true,
            perms: ['SEND_MESSAGES'],
            regexs: [
                /wade/gi
            ]
        };

        super(options);
    }

    async run(message: Message, args: string[]) {
        const wadeEmoji = message?.guild?.emojis.cache.get('1013644498909282314');

        message.react(wadeEmoji || '👍');
    }
}
