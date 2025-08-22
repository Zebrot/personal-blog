import fs from "fs";
import { pipeline } from '@huggingface/transformers';
import { getAllBlogs, getBlogBySlug } from "@/lib/blogs";
import similarity from "compute-cosine-similarity";
import { blogPost } from "@/lib/types/blog";

const embeddingPath = "articles-embeddings.json";

export interface Article {
    id?: number;
    articlePath: string;
    embeddings: number[];
    content: string;
}

export async function CreateEmbeddings() {
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

export function findClosestPosts(origin : blogPost, limit:number):blogPost[]{
  const blogsWithEmbeddings = fs.readFileSync('articles-embeddings.json').toString();
  const blogs = JSON.parse(blogsWithEmbeddings) as Article[];
  const original = blogs.filter(post => post.articlePath == origin.slug)[0];
  if (!original || !original.embeddings)
    throw new Error

  const similarities = blogs.map((blog)=> (
    {slug : blog.articlePath, similarity:similarity(blog.embeddings, original.embeddings)}
  ))
  similarities.sort((a,b)=> ((a.similarity || 0) > (b.similarity || 0)) ? 1 : - 1)
  return similarities.slice(1, limit + 1).map(x => getBlogBySlug(x.slug)); // We add 1 because [0] is always the origin post
}

async function createJsonFile(data : Article[]) {
  try {
    await fs.writeFile(embeddingPath, JSON.stringify(data, null, 2), ()=> {});
    console.log("File written successfully!");
  } catch (err) {
    console.error("Error writing file:", err);
  }
}