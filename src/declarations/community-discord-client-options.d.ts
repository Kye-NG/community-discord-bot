import { ClientOptions } from "discord.js";
import { Database } from "../classes/database";

export interface CommunityDiscordClientOptions {
    owners: (string | undefined)[];
    prefix: string;
    commandDirectory: string;
    debug: boolean;
    databaseClient: Database
}