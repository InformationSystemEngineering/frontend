export interface Message {
    id?: number;
    userId: number;
    userName?: string; // Ovo možete opcionalno slati ako backend očekuje
    psychologistId: number;
    psychologistName?: string; // Isto ovde
    content: string;
    isRead: boolean; // Da bude usklađeno sa backendom
    sender: string;
    topicId: number; // Dodajte polje za topicId
}
