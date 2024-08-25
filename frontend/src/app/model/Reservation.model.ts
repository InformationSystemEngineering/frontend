import { Time } from "@angular/common";

export interface Reservation {
    id?: number;
    startTime: Time;
    endTime: Time;
    classroomId: number;
  }