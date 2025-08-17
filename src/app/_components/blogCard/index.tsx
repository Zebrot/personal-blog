import { blogPost } from "@/lib/types/blog";
import Image from "next/image";
import "./blogCard.scss"
import Link from "next/link";
import Tags from "../tags";

export default function BlogCard(blog : blogPost) {
    return (
        <Link href={`/blog/${blog.slug}`}>
            <article className="blogCard">
                    <div className="blogCard__imgWrapper">
                        <Image src={blog.metadata.coverImage} alt={blog.metadata.title} height={200} width={200}/>
                    </div>
                    <div className="blogCard__text">
                        <div className="blogCard__text__title">
                            <h2>{blog.metadata.title}</h2>
                            <h3>
                                {<Tags tags={blog.metadata.tags}/> }
                            </h3>
                        </div>
                        <div className="blogCard__text__excerpt">
                            <p>
                                {blog.metadata.excerpt}
                            </p>
                        </div>
                        <div className="blogCard__text__date">
                            <p >
                                {blog.metadata.publishedAt}
                            </p>
                        </div>
                    </div>
            </article>
        </Link>

    )
}