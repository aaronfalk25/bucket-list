export interface Document {
    id: string;
    [key: string]: unknown;
}

export interface Collection {
    name: string
    documents: Document[];
}


