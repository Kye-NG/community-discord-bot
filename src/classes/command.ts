import { CommandOptions } from "../declarations/command-options";

export class Command {
    name: string;
    description: string;
    ownerOnly: boolean;
    aliases: string[];
    perms: string[];

	constructor(options: CommandOptions) {
		if (options.name === undefined) throw Error('No name property detected in command.');
		if (options.description === undefined) throw Error('No description detected in command.');
		if (options.aliases === undefined) options.aliases = [];
		if (!Array.isArray(options.aliases)) throw Error('Aliases must be an Array.');
		if (options.ownerOnly === undefined) options.ownerOnly = false;
		if (options.perms === undefined) options.perms = [];
		if (!Array.isArray(options.perms)) throw Error('Permissions must be an Array.');

		this.name = options.name;
		this.description = options.description;
		this.ownerOnly = options.ownerOnly;
		this.aliases = options.aliases;
		this.perms = options.perms;
	}
}

module.exports = Command;