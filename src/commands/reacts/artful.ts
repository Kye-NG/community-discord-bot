import { Message } from "discord.js";
import { Command } from "../../classes/command";
import { CommandOptions } from "../../declarations/command-options";

export default class ArtfulCommand extends Command {
    constructor() {
        const options: CommandOptions = {
            name: 'artful',
            description: 'If the message says artful or kye you get a react. ;)',
            ownerOnly: true,
            perms: ['SEND_MESSAGES'],
            regexs: [
                /artful/gi,
                /kye/gi
            ]
        };

        super(options);
    }

    async run(message: Message, args: string[]) {
        const artfulEmoji = message?.guild?.emojis.cache.get('1005002952232157304');

        message.react(artfulEmoji || '👍');
    }
}
