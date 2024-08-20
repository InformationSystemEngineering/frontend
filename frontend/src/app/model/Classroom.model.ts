import { Time } from "@angular/common";

export interface Classroom {
    disabled: boolean;
    id?: number;
    name: string;
    date: Date;
    startTime: Time;
    endTime: Time;
    floor: number;
    capacity: number;
  }
