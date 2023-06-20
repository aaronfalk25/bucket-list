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
    // TODO: Add # people
    likes: number;
    likedBy: string[];
}