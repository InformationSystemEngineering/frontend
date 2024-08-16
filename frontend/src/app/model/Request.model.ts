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
}

  export enum Status {
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    PENDING = 'PENDING',
  }