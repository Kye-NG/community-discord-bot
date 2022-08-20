import { EmbedBuilder, Message } from "discord.js";
import { Command } from "../classes/command";
import { CommunityDiscordClient } from "../classes/discord-client";
import { CommandOptions } from "../declarations/command-options";

export default class EvalCommand extends Command {
    constructor() {
        const options: CommandOptions = {
            name: 'eval',
            description: 'Evaluates code',
            ownerOnly: true,
            perms: ['SEND_MESSAGES']
        };

        super(options);
    }

    async run(message: Message, args: string[]) {
        try {
          // Evaluate (execute) our input
          const evaled = eval(args.join(' '));
    
          // Put our eval result through the function
          // we defined above
          const cleaned = await clean(evaled, (message.client as CommunityDiscordClient));
    
          // Reply in the channel with our result
          message.channel.send(`\`\`\`js\n${cleaned}\n\`\`\``);
        } catch (err) {
          // Reply in the channel with our error
          message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
        }
    }
}

const clean = async (text: string, client: CommunityDiscordClient) => {
    // If our input is a promise, await it before continuing
    if (text && text.constructor.name == "Promise")
      text = await text;
    
    if (typeof text !== "string")
      text = require("util").inspect(text, { depth: 1 });
    
    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));

    text = text.replaceAll((client.token as string), '[REDACTED]');
    
    return text;
}