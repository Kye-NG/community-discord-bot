import { ActivityType, Client, ClientOptions } from "discord.js";
import { CommunityDiscordClientOptions } from "../declarations/community-discord-client-options";
import cron from 'node-cron';
import TestCommand from "../commands/test";
import HelpCommand from "../commands/help";
import PingCommand from "../commands/ping";
import EvalCommand from "../commands/eval";
import TikTokCommand from "../commands/tiktok";
import TigheCommand from "../commands/reacts/tighe";
import ArtfulCommand from "../commands/reacts/artful";
import EmkayCommand from "../commands/reacts/emkay";
import DanielCommand from "../commands/reacts/daniel";
import JakeCommand from "../commands/reacts/jake";
import OliviaCommand from "../commands/reacts/olivia";
import InzaCommand from "../commands/reacts/inza";
import MomoCommand from "../commands/reacts/momo";
import NetteCommand from "../commands/reacts/nette";
import WadeCommand from "../commands/reacts/wade";
import VaderCommand from "../commands/reacts/vader";
import { Database } from "./database";
import { Activies } from "../declarations/activities";

const commandsList = [
	new TestCommand(),
	new HelpCommand(),
	new PingCommand(),
	new EvalCommand(),
	new TikTokCommand(),
	new TigheCommand(),
	new ArtfulCommand(),
	new EmkayCommand(),
	new DanielCommand(),
	new JakeCommand(),
	new OliviaCommand(),
	new InzaCommand(),
	new MomoCommand(),
	new NetteCommand(),
	new WadeCommand(),
	new VaderCommand()
];

export class CommunityDiscordClient extends Client {
    owners: (string | undefined)[];
    prefix: string;
    commandDirectory: string;
    debug: boolean;
    commands: Map<string, any>;
	databaseClient: Database;
	activities: Activies[] = [];

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
		this.databaseClient = customOptions.databaseClient;

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
		for (let command of commandsList) {
			this.commands.set(command.name, command);
		}

		if (this.debug) console.log(`Loaded ${this.commands.size} commands!`);
	}

	async initialiseActivities() {
		const restartAmount = await this.databaseClient.get('clientRestarts');
		this.user?.setActivity(`I've restarted ${restartAmount} times`, { type: ActivityType.Playing });

		// setup cronjob to change activity every 30 minutes
		// 0 * * * *
		cron.schedule('0 * * * *', async () => {
			await this.updateActivities();

			const activity = this.activities[Math.floor(Math.random() * this.activities.length)];

			this.user?.setActivity(activity.text, { type: activity.type });
		});
	}

	async updateActivities() {
		const tikTokCount = await this.databaseClient.get('tiktoksSent');
		const restartCount = await this.databaseClient.get('clientRestarts');
		const reactCount = await this.databaseClient.get('reactsSent');

		this.activities = [
			{ text: `${tikTokCount} tik toks so far!`, type: ActivityType.Watching },
			{ text: `I've restarted ${restartCount} times`, type: ActivityType.Playing },
			{ text: 'licking my butt', type: ActivityType.Playing },
			{ text: `${process.env.DISCORD_BOT_PREFIX}help for list`, type: ActivityType.Playing },
			{ text: `i've reacted ${reactCount} times`, type: ActivityType.Playing },
			{ text: 'to russian hardbass', type: ActivityType.Listening },
			{ text: '(´・ω・｀)', type: ActivityType.Watching },
		];
	}
}