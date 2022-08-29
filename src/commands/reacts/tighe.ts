import { Message } from "discord.js";
import { Command } from "../../classes/command";
import { CommandOptions } from "../../declarations/command-options";

export default class TigheCommand extends Command {
    constructor() {
        const options: CommandOptions = {
            name: 'tighe',
            description: 'If the message says tighe you get a react. ;)',
            ownerOnly: true,
            perms: ['SEND_MESSAGES'],
            regexs: [
                /tighe/gi
            ]
        };

        super(options);
    }

    async run(message: Message, args: string[]) {
        const tigheEmoji = message?.guild?.emojis.cache.get('1005059113027391548');

        message.react(tigheEmoji || '👍');
    }
}
