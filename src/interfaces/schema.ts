export interface User {
    uid: string;
    email?: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    darkMode: boolean;
    isSignedIn: boolean;
}

export interface BucketItem {
    id: string;
    name: string;
    description: string;
    date?: string;
    time?: string;
    cost?: string;
    numParticipants?: number;
    participants: string[];
    location?: string;
    likes: number;
    likedBy: string[];
    createdBy: string;
}

export interface Group {
    id: string;
    name: string;
    description: string;
    members: string[];
    createdBy: string;
}