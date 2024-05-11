import { HallDto } from "./hall.model";

export interface InternshipTest {
    id?: number;
    internshipTitle: string;
    date: Date; 
    time: string;
    hall?: HallDto;
    duration: number;
    testReviewed: boolean;
  }

export interface InternshipDto {
    id: number;
    date: Date; 
    title: string;
    category: InternshipCategory;
    imageUrl?: string;
}

export enum InternshipCategory {
  MENTAL_HEALTH_CARE = 'MENTAL_HEALTH_CARE',
  ADDICTION_REHABILITATION = 'ADDICTION_REHABILITATION',
  TRAUMA_COUNSELING = 'TRAUMA_COUNSELING',
  CHILD_AND_ADOLESCENT_PSYCHOLOGY = 'CHILD_AND_ADOLESCENT_PSYCHOLOGY',
  FAMILY_THERAPY = 'FAMILY_THERAPY',
  SCHOOL_COUNSELING = 'SCHOOL_COUNSELING',
}

  