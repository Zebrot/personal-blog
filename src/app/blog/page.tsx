import './blogList.scss';
import { getAllBlogs } from "@/lib/blogs";
import BlogCard from "../_components/blogCard";
import '../landing.scss'
import Hero from '../_components/hero';
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
            <Hero title='List of blogs' small/>            
            {blogList}
            <cite>End of blogs</cite>
        </div>
    )
}