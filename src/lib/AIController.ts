import { pipeline } from "@huggingface/transformers";
import {Database} from "better-sqlite3";

export async function retrieveTopThreePosts(query : string, db : Database) {
    
    const embeddingsGenerator = await pipeline("feature-extraction", "./local_models/all-MiniLM-L6-v2/", {
        local_files_only: true,
        dtype:'fp32'
    });
    const embeddingsOutput = await embeddingsGenerator(query, { pooling: "mean", normalize: true });
    const vector = embeddingsOutput.tolist();
    const rows = db
        .prepare(
        `
        SELECT rowid, distance, content, articlePath
        FROM blog_articles
        WHERE embedding MATCH ?
        ORDER BY distance
        LIMIT 3
        `
        )
        .all(new Uint8Array(new Float32Array(vector[0] as number[]).buffer));
    return rows;
}

