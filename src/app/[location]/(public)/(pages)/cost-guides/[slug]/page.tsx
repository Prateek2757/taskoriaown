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

export async function generateMetadata({params}:Props){
    const {slug} = await params;
    return{
        title: `${toTitleCase(slug)} Cost Guide`,
        alternates: {canonical: buildCanonical(slug)},
    }
}
export default async function CostGuide({params}:Props){
  const {slug} = await params;
    return(
   <CostGuidePage slug={slug}/>
    )
}