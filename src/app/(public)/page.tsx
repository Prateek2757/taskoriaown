import Categories from "@/components/Categories"
import CTA from "@/components/CTA"
import { FeatureProvider } from "@/components/FeatureProvider"
import FeaturesPage from "@/components/Features"
import Footer from "@/components/Footer"
import HeroSection from "@/components/Herosection"
import HowItWorks from "@/components/how-taskoria-works"
import SupportChatbot from "@/components/supportChatbox"
import Testomonail from "@/components/Testomonail"
import { WorldMapDemo } from "@/components/WorldMap"

function page() {
  return (
    <div className="dark:bg-black">
     
      <HeroSection/>
      <HowItWorks/>
      <Categories/>
      <FeaturesPage/>
      <Testomonail/>
      <FeatureProvider/>
      <CTA/>
      {/* <WorldMapDemo/> */}
      <Footer/>
      <SupportChatbot/>
    </div>
  )
}

export default page