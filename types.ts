
export interface Plant {
    id: string;
    commonName: string;
    scientificName: string;
    description: string;
    careInfo: {
        watering: string;
        light: string;
        soil: string;
    };
    imageUrl: string;
}

export interface UserPlant extends Plant {
    addedDate: string;
    lastWatered: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
}

export type Page = 'home' | 'database' | 'my-plants' | 'identify' | 'diagnostics' | 'tips' | 'chat';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}
