export interface FeedbackJournaling {
    id?: number;  
    contentGrade: number;
    psychologistGrade: number;
    finalGrade: number;
    organizationGrade: number;
    comment: string;
    contentGrades: number;
    organizationGrades: number;
    psychologistGrades: number;
    average_count: number;
    dateFilled: Date;
    operationType: string;

  }