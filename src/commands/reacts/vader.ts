import { Message } from "discord.js";
import { Command } from "../../classes/command";
import { CommandOptions } from "../../declarations/command-options";

export default class VaderCommand extends Command {
    constructor() {
        const options: CommandOptions = {
            name: 'vada',
            description: 'If the message says vada or bananafarts you get a react. ;)',
            ownerOnly: true,
            perms: ['SEND_MESSAGES'],
            regexs: [
                /vader/gi,
                /vada/gi,
                /bananafarts/gi
            ]
        };

        super(options);
    }

    async run(message: Message, args: string[]) {
        const vaderEmoji = message?.guild?.emojis.cache.get('1013643376488370180');

        message.react(vaderEmoji || '👍');
    }
}
