export interface CommandOptions {
    name: string;
    description: string;
    ownerOnly: boolean;
    aliases: string[];
    perms: string[];
}