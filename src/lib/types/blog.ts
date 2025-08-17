export interface blogPost{
    id : string;
    content : string;
    slug : string;
    metadata : blogMetaData;
}

export interface blogMetaData {
    title: string;
    excerpt: string;
    publishedAt: string;
    tags: string[];
    coverImage: string;
}