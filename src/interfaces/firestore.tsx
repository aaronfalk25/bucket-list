export interface Document {
    id: string;
    [key: string]: unknown;
}

export interface _Collection {
    name: string
    documents: Document[];
}


