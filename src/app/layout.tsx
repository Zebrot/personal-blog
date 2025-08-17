import Header from "./_components/header";
import './globals.scss';
import { Metadata } from "next";
import Footer from "./_components/footer";
import { getAllBlogs } from "@/lib/blogs";
export const metadata : Metadata = {
  title : "Pierre Terrancle's Blog",
  description : "A blog about technology, philosophy, and all things I'm passionate about ! ",
  openGraph: {
    title: "Pierre Terrancle's Blog",
    description : "A blog about technology, philosophy, and all things I'm passionate about ! ",
    images: [],
  },
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  const blogList = getAllBlogs();
  return (
    <html lang="fr">
        <body>
          <Header blogList={blogList}/>
          <main className="container">
            {children}
          </main>
          <Footer />
        </body>
    </html>
  )
}
