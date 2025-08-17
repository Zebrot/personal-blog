import Link from "next/link";
import './blogList.scss';
import { getAllBlogs } from "@/lib/blogs";
import BlogCard from "../_components/blogCard";
export default function blogPage() {
    const blogList = getAllBlogs().map((blog, index)=> {
        if(blog.metadata.title == '')
            return;
        return (
            <BlogCard key={index} {...blog}/>
        )
    });

    return (
        <div className="blogList">
            {blogList}
            <cite>End of blogs</cite>
        </div>
    )
}