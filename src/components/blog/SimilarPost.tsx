
interface Props{
   posts : posts[];
}

export default function SimilarPost({posts}: Props){
    return(
        <div>
            <h3 className="text-2xl font-bold text-gray-400 uppercase dark:text-zinc-50 mb-8 flex items-center gap-3">You might also be interested in:</h3>
            {posts.map((post)=>post.title)}
        </div>
    )
}