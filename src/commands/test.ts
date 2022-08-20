import { Message } from "discord.js";
import { Command } from "../classes/command";
import { CommandOptions } from "../declarations/command-options";

export default class TestCommand extends Command {
    constructor() {
        const options: CommandOptions = {
            name: 'test',
            description: 'Test command',
            ownerOnly: false,
            perms: ['SEND_MESSAGES']
        };

        super(options);
    }

    async run(message: Message, args: unknown) {
        message.channel.send('Hello');
        console.log('TestCommand run');
    }
}