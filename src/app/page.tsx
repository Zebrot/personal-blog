import './landing.scss'
import { getAllBlogs } from "@/lib/blogs"
import BlogCard from "./_components/blogCard";
import './blog/blogList.scss';
import Hero from './_components/hero';

const blogs = getAllBlogs();
export default function Homepage() {
    
    return (
        <div className="landing">
            <Hero title='Hello World' />
            <section className="landing__introText">
                <h2>Welcome to my Blog</h2>
                <p>
                    I&apos;m Pierre, a french web developper. I&apos;m passionate about all things Javascript, so I created this blog
                    to share my love of the web <span style={{fontStyle : 'italic'}}>to the web</span> .<br/><br/>
                    This blog is somewhere between a personnal project, a way to organize my thoughts, and a place for me to 
                    experiment new features as I teach myself NextJS, AI integration and more. <br/><br/>
                    I&apos;ll document the journey right here, so follow along ! 
                </p>

            </section>
            <div className="landing__socialList">

            </div>
            <section className="landing__blogList">
                <h2 className="borderBottom">Latest Posts</h2>
                <div className="blogList">
                    {blogs.slice(0,3).map((blog,i)=> <BlogCard key={i} {...blog}/>)}

                </div>
            </section>
        </div>
    )
}