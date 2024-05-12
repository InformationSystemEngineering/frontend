import { Time } from "@angular/common";
import { ExtraActivity } from "./ExtraActivity.model";
import { Psychologist } from "./Psychologist.model";

export interface Fair {
  id?: number;
  name: string;
  date: Date;
  startTime: Time;
  endTime: Time;
  description: string;
  facultyId?: number;
  publish: boolean;
  activites?: ExtraActivity[];
  psychologists?: Psychologist[];
}
