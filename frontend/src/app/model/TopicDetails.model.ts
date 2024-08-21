import { Topic } from "./Topic.model";

export interface TopicDetails extends Topic {
    classroom: { name: string };
    startTime: string;
    endTime: string;
}
