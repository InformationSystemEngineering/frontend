import { Time } from "@angular/common";

export interface Classroom {
    id?: number;
    name: string;
    date: Date;
    startTime: Time;
    endTime: Time;
    floor: number;
    capacity: number;
  }
