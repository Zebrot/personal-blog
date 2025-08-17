import Image from "next/image"
import './landing.scss'
import { getAllBlogs } from "@/lib/blogs"
import BlogCard from "./_components/blogCard";
import { blogPost } from "@/lib/types/blog";

const blogs = getAllBlogs();
export default function Homepage() {
    
    return (
        <div className="landing">
            <div className="landing__hero">
                <div className="">

                </div>  
                <div className="landing__hero__imgWrapper container">
                    <Image src="/default.png" alt='' fill />
                </div>
            </div>
            <section className="landing__introText">
                <h2>Welcome to my Blog</h2>
                <p>
                    I'm Pierre, a french web developper, but I like to call myself a citizen of the Internet, because honestly
                     this is where I spend most of my time !<br/><br/>
                    This blog is somewhere between a personnal project, a way to organize my thoughts, and a place for me to 
                    experiment new features as I teach myself NextJS, AI integration and more. <br/><br/>
                    I'll document the journey right here, so follow along ! 
                </p>

            </section>
            <div className="landing__socialList">

            </div>
            <section className="landing__blogList">
                <h2 className="borderBottom">Latest Blogs</h2>
                <div className="blogList">
                    {blogs.slice(0,3).map((blog,i)=> <BlogCard key={i} {...blog}/>)}

                </div>
            </section>
        </div>
    )
}