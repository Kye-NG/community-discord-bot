import { Message } from "discord.js";
import { Command } from "../classes/command";
import { CommandOptions } from "../declarations/command-options";

export default class PingCommand extends Command {
    constructor() {
        const options: CommandOptions = {
            name: 'ping',
            description: 'Ping to see if the bot is online. Returns "pong"',
            ownerOnly: false,
            perms: ['SEND_MESSAGES']
        };

        super(options);
    }

    async run(message: Message, args: unknown) {
        message.channel.send('Pong!');
    }
}