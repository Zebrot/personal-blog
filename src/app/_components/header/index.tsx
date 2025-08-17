'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import './header.scss';
import Image from 'next/image';
import Search from '../search';
import { blogPost } from '@/lib/types/blog';

export default function Header({blogList} : {blogList : blogPost[]}){
    const pathname = usePathname();
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
                    <div className='header__mainMenu__navigation'>
                        <li className={`${pathname==='/blog' && 'current'}`}> 
                            <Link href={'/blog'}>All Blogs</Link>
                        </li>
                        <li className={`${pathname==='/contact' && 'current'}`}>
                            <Link href={'/contact'}>Contact</Link>
                        </li>
                    </div>
                    <Search blogList={blogList}/>
                </nav>
            </div>
        </header>
    )
}