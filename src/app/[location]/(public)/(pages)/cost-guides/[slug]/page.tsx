import type { Metadata } from "next";
import CostGuidePage from "@/components/cost-guide/CostGuidePage"


type Props = {
params:Promise<{slug : string}>;
}

function toTitleCase(slug:string){
    return slug.replace(/-/g," ").replace(/\b\w/g, (l)=>l.toUpperCase());
}

function buildCanonical(slug: string,) {
    return  `https://www.taskoria.com/cost-guides/${slug}`;
   
}

export async function generateMetadata({params}:Props): Promise<Metadata>{
    const {slug} = await params;
    const guideTitle = toTitleCase(slug);
    return{
        title: `${guideTitle} Cost Guide | Taskoria`,
        description: `Compare ${guideTitle.toLowerCase()} prices, cost factors, and hiring tips before requesting free quotes from verified Taskoria professionals.`,
        alternates: {canonical: buildCanonical(slug)},
    }
}
export default async function CostGuide({params}:Props){
  const {slug} = await params;
    return(
   <CostGuidePage slug={slug}/>
    )
}
