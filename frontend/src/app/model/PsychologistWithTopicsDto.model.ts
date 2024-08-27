import { TopicDetails } from "./TopicDetails.model";


export interface PsychologistWithTopicsDto {
    psychologistId: number;
    psychologistName: string;
    psychologistLastName: string;
    topics: TopicDetails[];

}
