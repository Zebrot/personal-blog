import { getBlogBySlug } from "@/lib/blogs";
import { tokenizeMarkdown } from "@/lib/parser";
import { renderBlocks } from "@/lib/parser";
import { Metadata } from "next";
import '../blog.scss';
import '../blogList.scss'
import Image from "next/image";
import { getAllBlogs } from "@/lib/blogs";
import { findClosestPosts } from "../../../../AI-controller";
import Tags from "@/app/_components/tags";
import BlogCard from "@/app/_components/blogCard";

export async function generateStaticParams() {
    const blogs = getAllBlogs();
    return blogs.map((blog) => ({
        slug: blog.slug,
    }))
}

export async function generateMetadata({ params }: {params : Promise<{slug: string}> }): Promise< Metadata >{
    const {slug} = await params;
    const blog =  getBlogBySlug(slug)
    if(!blog){
        return{
            title: 'Blog article not found',
            description: 'no such blog here'
    }}

    return {
        metadataBase: new URL('https://terrancle.dev'),
        title: blog.metadata.title,
        description: blog.metadata.excerpt,
        openGraph: {
            title: blog.metadata.title,
            images: [blog.metadata.coverImage],
        },
    }
}


export default async function SingleBlog({params,}:{params : Promise<{slug : string}> }){
    const {slug} = await params;
    const blog = getBlogBySlug(slug);
    const recommended = findClosestPosts(blog, 2)

    if(!blog)
        return (<div>loading...</div>)


    const parsedContent = renderBlocks(tokenizeMarkdown(blog.content));
    return(
        <div className="blogContent">
            <div className="blogContent__hero">
                <Image src = {blog.metadata.coverImage} alt = {blog.metadata.title} fill style={ {objectFit : 'cover', display:'block'} }/>
                <h1 className='blogContent__hero__blogTitle'>{blog.metadata.title}</h1>
            </div>
            <Tags tags={blog.metadata.tags}/>
            <section className="blogContent__main">
                {parsedContent} 
            </section>
            <section className="recommendedContent">
                <div className="recommendedContent__title">
                    <h2>Recommended reads</h2>
                    <p>Explore more on the same subject</p>
                    <div className="blogList recommendedBloglist">
                        {recommended.map((post,index) => <BlogCard key={index} {...post}/>)}
                    </div>
                </div>
            </section>
        </div>
    )
}