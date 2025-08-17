export type blockNode =
    | { type: 'heading', level: number, content: string }
    | { type: 'paragraph', content: textNode[] }
    | {type : 'list', items : textNode[][]}

export type textNode = 
    | {type : 'italic', content : textNode[] }
    | {type : 'bold', content : textNode[] }
    | {type : 'centered', content : textNode[]}
    | {type : 'text', content : string }
    | {type : 'linebreak'}
    | {type : 'link', href : string, content : textNode[]}
    | {type : 'image', alt : string, src : string}
    | {type : 'linked_image', alt : string, src : string, href : string}
