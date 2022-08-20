export interface CommandOptions {
    name: string;
    description: string;
    ownerOnly: boolean;
    perms: string[];
    regexs?: RegExp[];
}