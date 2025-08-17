import DatabaseSync from "better-sqlite3";
import sqliteVec from 'sqlite-vec'
import { pipeline } from "@huggingface/transformers";

interface Article {
    id?: number;
    articlePath: string;
    embeddings: number[];
    content: string;
}

async function getEmbedding(content : string):Promise<number[]> {
    const text = content;
    const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {dtype:'fp32'});

    const output = await extractor(text, { pooling: "mean", normalize: true });
    const vector = output.tolist()[0];
    return vector;
}
