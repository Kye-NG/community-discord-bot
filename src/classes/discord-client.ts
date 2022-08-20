import { Client, ClientOptions } from "discord.js";
import { CommunityDiscordClientOptions } from "../declarations/community-discord-client-options";
import TestCommand from "../commands/test";
import HelpCommand from "../commands/help";
import PingCommand from "../commands/ping";
import EvalCommand from "../commands/eval";
import TikTokCommand from "../commands/tiktok";
import TigheCommand from "../commands/tighe";

export class CommunityDiscordClient extends Client {
    owners: (string | undefined)[];
    prefix: string;
    commandDirectory: string;
    debug: boolean;
    commands: Map<string, any>;

    constructor(discordOptions: ClientOptions, customOptions: CommunityDiscordClientOptions) {
        super(discordOptions);

        // Just incase checks.
        if (customOptions.owners === undefined) throw Error('You must specify atleast 1 ownerID.');
		if (!Array.isArray(customOptions.owners)) throw Error('Owners must be an Array.');
		if (customOptions.owners.length < 1) throw Error('You must specify atleast 1 ownerID');
		if (customOptions.prefix === undefined) customOptions.prefix = '!';
		if (customOptions.commandDirectory === undefined) throw Error('No commands directory specified');
		if (customOptions.debug === undefined) customOptions.debug = false;

		this.owners = customOptions.owners;
		this.prefix = customOptions.prefix;
		this.commandDirectory = customOptions.commandDirectory;
		this.debug = customOptions.debug;

        this.commands = new Map();
    }

    startup(token: string): Promise<void> {
		return new Promise(async(resolve, reject) => {
			this.loadCommands();

			await super.login(token).catch(reject);

			resolve();
		});
	}

	loadCommands() {
		const testCommand = new TestCommand();
		const helpCommand = new HelpCommand();
		const pingCommand = new PingCommand();
		const evalCommand = new EvalCommand();
		const tiktokCommand = new TikTokCommand();
		const tigheCommand = new TigheCommand();

		this.commands.set(testCommand.name, testCommand);
		this.commands.set(helpCommand.name, helpCommand);
		this.commands.set(pingCommand.name, pingCommand);
		this.commands.set(evalCommand.name, evalCommand);
		this.commands.set(tiktokCommand.name, tiktokCommand);
		this.commands.set(tigheCommand.name, tigheCommand);

		if (this.debug) console.log(`Loaded ${this.commands.size} commands!`);
	}
}