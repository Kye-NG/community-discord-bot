import { Message } from "discord.js";
import { CommandOptions } from "../declarations/command-options";

export class Command {
    name: string;
    description: string;
    ownerOnly: boolean;
    perms: string[];
	regexs: RegExp[];

	constructor(options: CommandOptions) {
		if (options.name === undefined) throw Error('No name property detected in command.');
		if (options.description === undefined) throw Error('No description detected in command.');
		if (options.ownerOnly === undefined) options.ownerOnly = false;
		if (options.perms === undefined) options.perms = [];
		if (!Array.isArray(options.perms)) throw Error('Permissions must be an Array.');
		if (options.regexs === undefined) options.regexs = [];

		this.name = options.name;
		this.description = options.description;
		this.ownerOnly = options.ownerOnly;
		this.perms = options.perms;
		this.regexs = options.regexs;
	}
	
	run(message: Message<boolean>, args: string[]): void {
        throw new Error("Method not implemented.");
    }
}