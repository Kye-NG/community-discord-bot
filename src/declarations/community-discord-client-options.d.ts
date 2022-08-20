import { ClientOptions } from "discord.js";

export interface CommunityDiscordClientOptions {
    owners: (string | undefined)[];
    prefix: string;
    commandDirectory: string;
    debug: boolean;
    unknownCommandResponse: boolean;
}