import { Faculty } from "./Faculty.model";

export interface CustomRequest {
  id?: number;
  name: string;
  startDate: Date;
  endDate: Date;
  description: string;
  facultyId?: number;
  status: Status;
  userId: number;
  email?: string;
  numberOfDays: number;
  sentDate: Date;
  faculty?: Faculty;
  canceled?: boolean;
}

  export enum Status {
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    PENDING = 'PENDING',
  }