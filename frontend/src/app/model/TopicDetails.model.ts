import { Psychologist } from "./Psychologist.model";

export interface TopicDetails {
    psychologistId: any;
    id: number; // Obavezno postavi ispravnu tipizaciju
    name: string;
    duration: number;
    availableSpots: number;
    classroom: { name: string };
    startTime: string;
    endTime: string;
    date?: Date;
    psychologists: Psychologist[];
    reservationId: number;
    disabled: boolean;
    facultyName: string;
    requestName: string;
    pdfUrl: string;
    showApplyButton?: boolean;
    showOpenFileButton? : boolean;
}
