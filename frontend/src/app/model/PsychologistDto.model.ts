export interface PsychologistDto {
    id: number;           // ID psihologa
    name: string;         // Ime psihologa
    lastName: string;     // Prezime psihologa
    biography?: string;   // Kratka biografija psihologa, opcionalno polje
    imageUrl?: string;    // URL slike psihologa, opcionalno polje
}
