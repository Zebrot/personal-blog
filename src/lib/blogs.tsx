import path from "path";
import fs from 'fs';
import { blogPost, blogMetaData } from './types/blog'
const contentDirectory = path.join(process.cwd(), 'content', 'blogs');


export function getBlogBySlug(slug: string):blogPost{
    const filePath = path.join(contentDirectory, `${slug}.md`);
    if (!fs.existsSync(filePath))
        return {id: '', slug : '', content : '', metadata : {title:'', excerpt :'', publishedAt :'', coverImage: '/default.png',tags:[] }}
;
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsedFile = parseMarkdownFile(fileContent);
    return { id: filePath, slug, content: parsedFile.content, metadata : parsedFile.metadata };
}

export function getAllBlogs():blogPost[]{ 
    const fileNames = fs.readdirSync(contentDirectory);
    const blogs = fileNames
        .filter((name) => name.endsWith('.md'))
        .map((name) => {
            const slug = name.replace(/\.md$/, '');
            const fullPath = path.join(contentDirectory, name);
            const fileContent = fs.readFileSync(fullPath, 'utf8');
            const parsedFile = parseMarkdownFile(fileContent);
            return { id:fullPath, slug, content: parsedFile.content, metadata : parsedFile.metadata };
        });
        blogs.sort((a,b) => 
        b.metadata.publishedAt.split('/').reverse().join('')
        .localeCompare(a.metadata.publishedAt.split('/').reverse().join(''))
        )
    return blogs;
}

function parseMarkdownFile(content: string):{metadata : blogMetaData, content : string} {
    const frontmatterRegex = /^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
  
    if (!match || !match[1]) {
        return { metadata: {title : '', excerpt:'', publishedAt : '', coverImage : '/default.png', tags:[]}, content: content };
    }
  
    const frontmatter = match[1];
    const markdownContent = match[2];

    const metadata: Record<string, unknown> = {};

    frontmatter.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':')
        if (key && valueParts.length) {
            const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '')
            
            // Type-safe assignment
            switch (key.trim()) {
                case "title":
                case "excerpt":
                case "coverImage":
                case "publishedAt":
                    metadata[key.trim()] = value;
                    break;
                case "tags":
                    metadata[key.trim()] = value
                                            .replace(/[\[\]]/g, '')
                                            .split(",")
                                            .map(tag => tag.trim()
                                            .replace(/^["']|["']$/g, ''));
                    break;
                }
        }
    });


    return { 
        metadata : sanitizeMetadata(metadata),
        content: markdownContent ? markdownContent : ''
    };
}

function sanitizeMetadata(rawMetadata : Record<string,unknown>): blogMetaData {
    const verifiedMetadata = {
        title : typeof(rawMetadata.title) == 'string' ? rawMetadata.title : 'Unknown Title',
        excerpt : typeof(rawMetadata.excerpt) == 'string' ? rawMetadata.excerpt : 'No excerpt',
        publishedAt : typeof(rawMetadata.publishedAt) == 'string' ? rawMetadata.publishedAt : 'No date',
        tags : Array.isArray(rawMetadata.tags) && rawMetadata.tags.every((value) => typeof(value) === 'string') ? rawMetadata.tags : ['no tags'],
        coverImage : typeof(rawMetadata.coverImage) == 'string' ? rawMetadata.coverImage : '/default.png'
    }
    return verifiedMetadata;
}