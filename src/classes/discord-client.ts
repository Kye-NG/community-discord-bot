import { Client, ClientOptions } from "discord.js";
import { CommunityDiscordClientOptions } from "../declarations/community-discord-client-options";
import { Command } from "./command";
import { readdir } from 'fs';
import { extname, join } from 'path';

export class CommunityDiscordClient extends Client {
    owners: (string | undefined)[];
    prefix: string;
    commandDirectory: string;
    debug: boolean;
    unknownCommandResponse: boolean;
    commands: Map<any, any>;

    constructor(discordOptions: ClientOptions, customOptions: CommunityDiscordClientOptions) {
        super(discordOptions);

        // Just incase checks.
        if (customOptions.owners === undefined) throw Error('You must specify atleast 1 ownerID.');
		if (!Array.isArray(customOptions.owners)) throw Error('Owners must be an Array.');
		if (customOptions.owners.length < 1) throw Error('You must specify atleast 1 ownerID');
		if (customOptions.prefix === undefined) customOptions.prefix = '!';
		if (customOptions.commandDirectory === undefined) throw Error('No commands directory specified');
		if (customOptions.debug === undefined) customOptions.debug = false;
		if (customOptions.unknownCommandResponse === undefined) customOptions.unknownCommandResponse = false;

        /**
		 * The IDs of the bot owners.
		 * @type {string[]}
		 */
		this.owners = customOptions.owners;

		/**
		 * The prefix of the bot.
		 * @type {string}
		 */
		this.prefix = customOptions.prefix;

		/**
		 * The directory of the commands.
		 * @type {string}
		 */
		this.commandDirectory = customOptions.commandDirectory;

		/**
		 * Whether or not to log extra information to console.
		 * @type {boolean}
		 */
		this.debug = customOptions.debug;

		/**
		 * If the bot should respond if it sees a message that starts with it's prefix but isn't a command.
		 * @type {boolean}
		 */
		this.unknownCommandResponse = customOptions.unknownCommandResponse;

        this.commands = new Map();
    }

    startup(token: string): Promise<void> {
		return new Promise((resolve, reject) => {
			super.login(token).catch(reject);

			readdir(this.commandDirectory, (err, files) => {
				if (err) console.error(err);

				for (const file of files) {
					const Command = join(this.commandDirectory, file);
					const cmd = new Command();

					this.commands.set(cmd.name, cmd);

					if (this.debug) console.log(`Loaded ${cmd.name}.js`);
				}

				if (this.debug) console.log(`Loaded ${this.commands.size} commands!`);

				resolve();
			});
		});
	}
}