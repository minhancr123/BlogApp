import Link from "next/link";
import React, { Children, ReactNode } from "react";
import {LinkIt , LinkItUrl} from "react-linkify-it";

interface LinkiFyProps {
    children : React.ReactNode
}

export default function LinkiFy({children} : LinkiFyProps ) {
    return <LinkiFyUsername >
            <LinkiFyHashtag >
                <LinkItUrl children = {children}></LinkItUrl>
            </LinkiFyHashtag>
    </LinkiFyUsername>
}

function LinkiFyUrl({children} : LinkiFyProps) {
    return <LinkItUrl className="text-primary underline">{children}</LinkItUrl>
}

function LinkiFyUsername({children} : LinkiFyProps) {
    return <LinkIt
     regex={/(@[a-zA-Z0-9_-]+)/}

     component={(match , key ) => {
        const username = match.slice(1);
        return <Link key={key} href={`/users/${username}`} className="text-primary underline">
            {match}
        </Link>
     }}
    >
        {children}
    </LinkIt>
}   


function LinkiFyHashtag({children} : LinkiFyProps) {
    return <LinkIt
     regex={/(#[a-zA-Z0-9]+)/}
    
     component={(match , key ) => {
        const hashtag = match.slice(1);
        return <Link key={key} href={`/users/${hashtag}`} className="text-primary underline">
            {match}
        </Link>
     }}
    >
        {children}
    </LinkIt>
}