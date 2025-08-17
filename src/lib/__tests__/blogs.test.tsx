import { getBlogBySlug } from "../blogs";
test('blogBySlug should always return something.',()=> {
        expect(getBlogBySlug('nonsense')).toBe(false);
        expect(getBlogBySlug('emptyBlog')).toStrictEqual(
            {id:'C:\\Users\\piter\\Desktop\\Dev\\Projets\\NextBlog\\personal-blog\\content\\blogs\\emptyBlog.md', 
                metadata : {title: '',excerpt:'',publishedAt:'', tags :[]}, 
                content : '', 
                slug:'emptyBlog'});
    }
)

test('parseMarkdownFile should do a bunch of shit', ()=> {
    //expect(parseMarkdownFile())
})