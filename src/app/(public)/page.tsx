import Categories from "@/components/Categories"
import CTA from "@/components/CTA"
import { FeatureProvider } from "@/components/FeatureProvider"
import { Features } from "@/components/Features"
import Footer from "@/components/Footer"
import HeroSection from "@/components/Herosection"
import HowItWorks from "@/components/how-taskoria-works"
import SupportChatbot from "@/components/supportChatbox"
import Testomonail from "@/components/Testomonail"

function page() {
  return (
    <div>
     
      <HeroSection/>
      <HowItWorks/>
      <Categories/>
      <Features/>
      <Testomonail/>
      <FeatureProvider/>
      <CTA/>
      <Footer/>
      <SupportChatbot/>
    </div>
  )
}

export default page