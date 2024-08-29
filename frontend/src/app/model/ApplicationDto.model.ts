export interface ApplicationDto {
    studentId: number;  // Automatski će biti postavljeno prilikom slanja
    topicId: number;    // ID teme na koju se prijavljuje
    name: string;                // Ime studenta
    surname: string;             // Prezime studenta
    studyYear: string;           // Godina studija
    email: string;               // Email studenta
  }
  