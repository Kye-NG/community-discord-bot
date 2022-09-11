import { ActivityType } from "discord.js";

export interface Activies {
    text: string;
    type: ActivityType.Playing | ActivityType.Streaming | ActivityType.Listening | ActivityType.Watching | ActivityType.Competing | undefined;
}