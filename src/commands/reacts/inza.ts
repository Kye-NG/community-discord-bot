import { Message } from "discord.js";
import { Command } from "../../classes/command";
import { CommandOptions } from "../../declarations/command-options";

export default class InzaCommand extends Command {
    constructor() {
        const options: CommandOptions = {
            name: 'inza',
            description: 'If the message says brandon or inza you get a react. ;)',
            ownerOnly: true,
            perms: ['SEND_MESSAGES'],
            regexs: [
                /inza/gi,
                /brandon/gi
            ]
        };

        super(options);
    }

    async run(message: Message, args: string[]) {
        const inzaEmoji = message?.guild?.emojis.cache.get('1013646155768410232');

        message.react(inzaEmoji || '👍');
    }
}
