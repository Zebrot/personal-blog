import './tags.scss';
export default function Tags({tags} : {tags:string[]}) {
    return (
        <ul className='tagList'>
            {tags.map((tag,index)=> (
                <button key={index} className="tag">
                    {tag}
                </button>
            ))}
        </ul>
    )
}