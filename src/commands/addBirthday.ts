import { Message } from "discord.js";
import { Command } from "../classes/command";
import { CommunityDiscordClient } from "../classes/discord-client";
import { Birthdays } from "../declarations/birthdays";
import { CommandOptions } from "../declarations/command-options";

export default class AddBirthdayCommand extends Command {
    constructor() {
        const options: CommandOptions = {
            name: 'setbd',
            description: 'Set your birthday into the system, supported users only',
            ownerOnly: false,
            perms: ['SEND_MESSAGES']
        };

        super(options);
    }

    async run(message: Message, args: string[]) {
        const friendRole = message.guild?.roles.cache.get('1004973043757633546');
        if (!friendRole) { return; }

        const hasFriendRole = message.member?.roles.cache.has(friendRole.id);
        if (!hasFriendRole) { 
            if (message.deletable) {
                await message.delete();
            }

            return message.channel.send(`What's wrong ${message.author.toString()}, No bitches? ( ͡° ͜ʖ ͡°)`);
        }

        if (!args.length) { return message.channel.send(`You need to provide a date in the format of \`DD/MM/YYYY\``); }

        const birthday = args[0];

        let currentBirthdays: Birthdays = (message.client as CommunityDiscordClient).databaseClient.get('birthdays');

        if (!currentBirthdays) {
            currentBirthdays = {};
        }

        currentBirthdays[message.author.id] = birthday;

        await (message.client as CommunityDiscordClient).databaseClient.set('birthdays', currentBirthdays);

        message.author.send(`Your birthday has been set to \`${birthday}\`\nI'll send a message in squad chat on your birthday to wish you a happy one! :3\n\nIf you want to change your birthday, just run this command again with a new date!`);

        if (message.deletable) {
            await message.delete();
        }

        message.channel.send(`${message.author.toString()} Birthday set! If anyone hasn't set their birthday use \`${(message.client as CommunityDiscordClient).prefix}${this.name} DD/MM/YYYY\` to set it!`);
    }
}