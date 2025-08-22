'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import './header.scss';
import Search from '../search';
import { blogPost } from '@/lib/types/blog';
import { useState } from 'react';

export default function Header({blogList} : {blogList : blogPost[]}){
    const pathname = usePathname();
    const [isActive, setActive] = useState(false);

    return (
        <header className="header">
            <div className='container'>
                <Link href='/' className='logo'>
                🤖
                    {
                    //<Image alt = 'logo' src={'/default.png'} width={80} height={80} style={{borderRadius : '25px'}}/>
                    }
                </Link>
                <nav className="header__mainMenu">
                    <div className={`header__mainMenu__navigation ${(isActive ? 'active' : '')}`} onClick={()=>{if(isActive) setActive(false)}}>
                        <li className={`${pathname==='/blog' && 'current'}`}> 
                            <Link href={'/blog'}>All Posts</Link>
                        </li>
                        <li className={`${pathname==='/contact' && 'current'}`}>
                            <Link href={'/contact'}>Contact</Link>
                        </li>
                    </div>
                    <div className={`hamburger ${isActive && 'active'}`} onClick={()=>{
                        setActive(!isActive)
                    }}>
                        <div className='topBar'></div>
                        <div className='middleBar'></div>
                        <div className='bottomBar'></div>
                    </div>

                    <Search blogList={blogList}/>
                </nav>
            </div>
        </header>
    )
}