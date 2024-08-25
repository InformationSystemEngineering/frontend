export interface TopicDetails {
    id: number; // Obavezno postavi ispravnu tipizaciju
    name: string;
    duration: number;
    availableSpots: number;
    classroom: { name: string };
    startTime: string;
    endTime: string;
    date?: Date;
}
