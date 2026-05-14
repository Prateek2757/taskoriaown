"use client"

type Props= {
    slug : string;
}
export default function BlogDetails({slug}:Props){

    return(
        <> 
        <h1>{slug}</h1>
        </>
    )
}