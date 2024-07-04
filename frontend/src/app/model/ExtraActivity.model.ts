import { Time } from "@angular/common";

export interface ExtraActivity {
    id?: number;
    name: String;
    activityType: ActivityType;
    date: Date;
    startTime: Time;
    endTime: Time;
    fairPsychologyId: number;
    classroom: String;
    capacity: number;
    rate: boolean;
    applied?: boolean; // Novo svojstvo
  }

  export enum ActivityType {
    WORKSHOP = 'WORKSHOP',
    LECTURE = 'LECTURE',
    MOCK_INTERVIEW = 'MOCK_INTERVIEW',
    COMPETITION = 'COMPETITION',
  }
  