import { Message } from "discord.js";
import { Command } from "../classes/command";
import { CommandOptions } from "../declarations/command-options";

export default class EmkayCommand extends Command {
    constructor() {
        const options: CommandOptions = {
            name: 'emkay',
            description: 'If the message says emily, emkay or ekaitaiga you get a react. ;)',
            ownerOnly: true,
            perms: ['SEND_MESSAGES'],
            regexs: [
                /emkay/gi,
                /emily/gi,
                /ekaitaiga/gi
            ]
        };

        super(options);
    }

    async run(message: Message, args: string[]) {
        const emilyEmoji = message?.guild?.emojis.cache.get('1007663404330266624');

        message.react(emilyEmoji || '👍');
    }
}
