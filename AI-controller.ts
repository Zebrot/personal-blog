import fs from "fs";
import { getBlogBySlug } from "@/lib/blogs";
import similarity from "compute-cosine-similarity";
import { blogPost } from "@/lib/types/blog";


export interface Article {
    id?: number;
    articlePath: string;
    embeddings: number[];
    content: string;
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
