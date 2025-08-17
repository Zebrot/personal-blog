import { blockNode, textNode } from "./types/parser";
import React from "react";
import Image from "next/image";
export function tokenizeMarkdown(markdown: string): blockNode[] {
    const lines = markdown.split('\n');
    const tokens: blockNode[] = [];

    let buffer: string[] = [];

    const flushParagraph = () => {
        const paragraphText = buffer.join(' ').trimStart();
        if(buffer.length > 0){
            tokens.push({ type: 'paragraph', content : inlineTokenize(paragraphText) });
            buffer = [];
        }
    };

    function inlineTokenize(input: string): textNode[] {
        const tokens: textNode[] = [];
        let i = 0;

        const formatTriggerRegex = /--|\*\*|\*|!\[|\[|\n/g;

        while (i < input.length) {
            formatTriggerRegex.lastIndex = i; // reset regex position
            const match = formatTriggerRegex.exec(input);

            if (!match) {
                // No more formatting → push remainder as text
                tokens.push({ type: 'text', content: input.slice(i) });
                break;
            }

            const matchIndex = match.index;

            // Push plain text before formatting marker
            if (matchIndex > i) {
                tokens.push({ type: 'text', content: input.slice(i, matchIndex) });
            }

            const marker = match[0];
            i = matchIndex; // position now at marker

            // ---- BOLD ----
            if (marker === '**') {
                const end = input.indexOf('**', i + 2);
                if (end !== -1) {
                    tokens.push({
                        type: 'bold',
                        content: inlineTokenize(input.slice(i + 2, end)),
                    });
                    i = end + 2;
                    continue;
                }
            }

            // ---- ITALIC ----
            if (marker === '*') {
            const end = input.indexOf('*', i + 1);
            if (end !== -1) {
                tokens.push({
                    type: 'italic',
                    content: inlineTokenize(input.slice(i + 1, end)),
                });
                i = end + 1;
                continue;
            }
            }
            // ---- CENTERED ---- 
            if(marker == '--') {
                const end = input.indexOf('--', i+2);
                if (end !== -1){
                    tokens.push({
                        type: 'centered',
                        content: inlineTokenize(input.slice(i+2, end - 1 ))
                    });
                    i = end + 2;
                    continue;
                }
            }
            // ---- LINKED IMAGE ---- 
            if(marker == '[' && input[i+1] === '!') {
                // Pattern: [![alt](src)](href)
                const imgStart = i + 1; // Position of '!'
                const imgEndBracket = input.indexOf(']', imgStart + 2);
                if (imgEndBracket !== -1 && input[imgEndBracket + 1] === '(') {
                    const imgEndParen = input.indexOf(')', imgEndBracket + 2);
                    
                    if (imgEndParen !== -1 && input[imgEndParen + 1] === ']' && input[imgEndParen + 2] === '(') {
                        const linkEndParen = input.indexOf(')', imgEndParen + 3);
                        
                        if (linkEndParen !== -1) {
                            const alt = input.slice(imgStart + 2, imgEndBracket);
                            const src = input.slice(imgEndBracket + 2, imgEndParen);
                            const href = input.slice(imgEndParen + 3, linkEndParen);
                            
                            tokens.push({
                                type: 'linked_image',
                                alt,
                                src,
                                href
                            });
                            i = linkEndParen + 1;
                            continue;
                        }
                    }
                }


            }

            // ---- IMAGE ----
            if(marker == '![') {
                const endBracket = input.indexOf(']', i + 2);
                if( endBracket !== -1 && input[endBracket + 1] === '(') {
                    const endParen = input.indexOf(')', endBracket + 2);
                    if (endParen !==  -1 ) {
                        const alt = input.slice(i + 2, endBracket);
                        const src = input.slice(endBracket + 2, endParen);
                        tokens.push({
                            type: 'image',
                            alt,
                            src
                        });
                        i = endParen + 1;
                        continue;
                    }
                }

            }

            // ---- LINK ----
            if (marker === '[') {
                const endBracket = input.indexOf(']', i + 1);
                if (endBracket !== -1 && input[endBracket + 1] === '(') {
                    const endParen = input.indexOf(')', endBracket + 2);
                    if (endParen !== -1) {
                        const linkText = input.slice(i + 1, endBracket);
                        const href = input.slice(endBracket + 2, endParen);
                        tokens.push({
                            type: 'link',
                            href,
                            content: inlineTokenize(linkText),
                        });
                        i = endParen + 1;
                        continue;
                    }
                }
            }

            // ---- LINE BREAK ----
            if (marker === '\n') {
                tokens.push({ type: 'linebreak' });
                i += 1;
                continue;
            }

            // ---- FALLBACK ----
            tokens.push({ type: 'text', content: marker });
            i += marker.length;
        }

        return tokens;
        }


    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed === ''){ // EMPTY LINES
            buffer.push('\n');
            continue;
        }

        if (/^[-*] /.test(trimmed)) { // LISTS
            const itemText = trimmed.slice(2).trim();
            let lastToken = tokens[tokens.length - 1]

            if (!lastToken || lastToken.type !== 'list'){
                flushParagraph();
                tokens.push({type:'list', items : []});
                lastToken = tokens[tokens.length - 1]; 
            } 
            if (!lastToken || lastToken.type !== 'list') // Just to make TS happy. There is logically no way for this to ever happen.
                continue;

            lastToken.items.push(inlineTokenize(itemText));
            continue;
        }

        if (trimmed.startsWith('#')) { // HEADINGS
            flushParagraph();
            let level = 0;
            for(let i = 0; i< 6; i++) {
                if(trimmed[i] === '#')
                    level++;
            }
            tokens.push({type : 'heading', level, content : trimmed.slice(level)})
            continue;
        }

        buffer.push(line) // Default
    }

    flushParagraph(); // flush any remaining paragraph

    return tokens;
}

export function renderBlocks(blocks : blockNode[]): React.ReactNode[] {
    function renderInline(nodes : textNode[]): React.ReactNode[]{
        return nodes.map((node, index)=> {
            switch(node.type){
                case 'text' :
                    return node.content;
                case 'bold' : 
                    return <b key={index}>{renderInline(node.content)}</b>;
                case 'italic' : 
                    return <i key={index}>{renderInline(node.content)}</i>;
                case 'linebreak' : 
                    return <br key={index}/>;
                case 'centered' : 
                    return <span key={index} className="centered_paragraph">{renderInline(node.content)}</span>;
                case 'linked_image' : 
                    return (
                        <a className='linked_image' key={index} href={node.href}>
                            <Image 
                                src = {node.src} 
                                alt = {node.alt} 
                                width={600} 
                                height={400} 
                                style={ {objectFit : 'cover', display:'block'} }
                            />
                        </a>
                    )
                case 'link' : 
                    return <a key={index} href={node.href}>{renderInline(node.content)}</a>;
                case 'image' : 
                    return <Image 
                        key = {index} 
                        src = {node.src} 
                        alt = {node.alt} 
                        width={600} 
                        height={400} 
                        style={ {objectFit : 'cover', display:'block'} }
                    />
                
            }

        })
    }
    
    return blocks.map((block, index)=> {
        switch(block.type){
            case 'heading' :
                const tag = React.createElement(
                    `h${block.level}`, 
                    {key : index}, 
                    renderInline( [ {type : 'text', content : block.content} ] )
                );
                return (tag);
            case 'paragraph' :
                return <p key={index}> {renderInline(block.content)}</p>;
            case 'list' : 
                const listItems = block.items.map((item, i)=> (
                    <li key ={i}>{renderInline(item)}</li>
                ));
                return (
                <ul key = {index}> 
                     {listItems}
                </ul>
            )
        }
    })
}
