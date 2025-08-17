import * as sqliteVec from 'sqlite-vec'
import DatabaseSync from 'better-sqlite3';
import fs from "fs";
import path from "path";
import { pipeline } from '@huggingface/transformers';
import { getAllBlogs } from "@/lib/blogs";

const embeddingPath = "articles-embeddings.json";

interface Article {
    id?: number;
    articlePath: string;
    embeddings: number[];
    content: string;
}

async function CreateEmbeddings() {

    const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {dtype:'fp32'});
    const blogs = getAllBlogs();
    let blogsWithEmbeddings:Article[] = []; 
    for(const blog of blogs) {
        const rawBlogData = [
            `Title : ${blog.metadata.title}`, 
            `Tags : ${blog.metadata.tags.join('-')}`, 
            `Excerpt : ${blog.metadata.excerpt}`,
            `Content : ${blog.content}`
        ];
        const output = await extractor(rawBlogData, { pooling: "mean", normalize: true })
        const embeddings = output.tolist()[0];
        blogsWithEmbeddings.push({articlePath : blog.slug, content : blog.content, embeddings});
    }

    if (fs.existsSync(embeddingPath)) {
        fs.unlinkSync(embeddingPath); // Delete the existing file
    }
    
    createJsonFile(blogsWithEmbeddings);
}

async function createJsonFile(data : Article[]) {
  try {
    await fs.writeFile(embeddingPath, JSON.stringify(data, null, 2), ()=> {});
    console.log("File written successfully!");
  } catch (err) {
    console.error("Error writing file:", err);
  }
}

const dbFilePath = "blog_articles.sqlite3";

export async function createDatabase() {

    await CreateEmbeddings();
    const articlesEmbeddings = JSON.parse(fs.readFileSync(path.resolve("./articles-embeddings.json"), "utf-8"));

    // Ensure the database file doesn't exist before creating a new one
    if (fs.existsSync(dbFilePath)) {
        fs.unlinkSync(dbFilePath); // Delete the existing file
    }

    const db = new DatabaseSync(dbFilePath, { allowExtension: true } as any); // No typing support for allowExtension so far.
    sqliteVec.load(db);

    const items = articlesEmbeddings.map((article: Article, index: number) => {
        const blobData = new Uint8Array(new Float32Array(article.embeddings as number[]).buffer);
        return {
            id: index + 1,
            embeddings: blobData,
            content: article.content,
            articlePath: article.articlePath,
        };
    }) as Article[];

    const vectorDimension = articlesEmbeddings.length > 0 ? articlesEmbeddings[0].embeddings.length : 384;

    // Create the virtual table with proper vector syntax
    db.exec(`CREATE VIRTUAL TABLE blog_articles USING vec0(
        content TEXT,
        articlePath TEXT,
        embedding float[${vectorDimension}]
    )`);
    
    // Insert the items into the database
    for (const item of items) {
        const itemId = Number.isInteger(item.id) ? item.id : Math.floor(Number(item.id));
        // Escape single quotes in content to prevent SQL injection
        const safeContent = item.content.replace(/'/g, "''");
        const safeArticlePath = item.articlePath.replace(/'/g, "''");

        db.exec(
            `INSERT INTO blog_articles(rowid, content, articlePath, embedding)
             VALUES (${itemId}, '${safeContent}', '${safeArticlePath}', x'${Buffer.from(item.embeddings).toString(
                 "hex"
             )}')`
        );
    }
    db.close();
}

createDatabase();
