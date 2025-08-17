'use client'  

import Image from "next/image";
import { useState } from "react";
import './searchForm.scss'
import { blogPost } from "@/lib/types/blog";
import Link from "next/link";

export default function Search({blogList} : {blogList : blogPost[]}){
    const [query, setQuery] = useState('');
    const [isFocused, setFocused] = useState(false);
    return (
        <div className="searchContainer"
            tabIndex={100}
            onFocus={() => setFocused(true)}
            onBlur = {(e)=> {
                const currentTarget = e.currentTarget;
                requestAnimationFrame(() => {
                    if (!currentTarget.contains(document.activeElement)){
                        setFocused(false)
                        setQuery('');
                    }
                    
                })
            }}
        >
            <form className='searchForm'>
                <input
                type="text"
                id="search-input"
                name="search"
                placeholder="Search"
                onChange={(e) => setQuery(e.target.value)}
                value = {query}
                />
                <button type="reset" onClick={()=>setQuery('')}>
                    {(isFocused && query) && 
                    <Image src={'/svg/XCircle.svg'} alt={''} width={30} height={30} style={{height:'100%'}}/>}
                </button>
            </form>
            <div className={`searchResults ${isFocused && query &&'show'}`} >
                {blogList.flatMap((post, index)=> (
                    (post.metadata.title.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) != -1 ) &&
                    <Link onClick={()=>{
                            setFocused(false)
                            setQuery('');
                        }}
                        key={index} 
                        href={`/blog/${post.slug}`}>
                        {post.metadata.title}
                    </Link>
                ))}
            </div>

        </div>
    )
}
