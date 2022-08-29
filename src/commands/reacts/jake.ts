import { Message } from "discord.js";
import { Command } from "../../classes/command";
import { CommandOptions } from "../../declarations/command-options";

export default class JakeCommand extends Command {
    constructor() {
        const options: CommandOptions = {
            name: 'jake',
            description: 'If the message says jake or rageling you get a react. ;)',
            ownerOnly: true,
            perms: ['SEND_MESSAGES'],
            regexs: [
                /jake/gi,
                /ragelin/gi
            ]
        };

        super(options);
    }

    async run(message: Message, args: string[]) {
        const JakeEmoji = message?.guild?.emojis.cache.get('1010891970501156925');

        message.react(JakeEmoji || '👍');
    }
}
