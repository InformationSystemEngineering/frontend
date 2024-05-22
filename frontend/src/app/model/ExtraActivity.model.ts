import { Time } from "@angular/common";

export interface ExtraActivity {
    id?: number;
    name: String;
    activityType: String;
    date: Date;
    startTime: Time;
    endTime: Time;
    fairPsychologyId: number;
    classroom: String;
    capacity: number;
  }