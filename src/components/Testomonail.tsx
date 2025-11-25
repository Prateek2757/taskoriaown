"use client"
import { Star } from "lucide-react";
import { motion } from "motion/react";

const testimonials = [
    {
      name: "David Thompson",
      role: "Startup Founder",
      content: "Taskoria's AI matching system connected me with the perfect developer for my project. The blockchain verification gave me complete confidence in my choice.",
      rating: 5
    },
    {
      name: "Maria Santos",
      role: "Small Business Owner", 
      content: "The community features are amazing! I learned so much from other entrepreneurs and found incredible service providers through recommendations.",
      rating: 5
    }
  ];

function Testomonail() {
  return (
    <section className="bg-card     dark:bg-[radial-gradient(circle_at_top,_rgba(76,112,255,0.18)_0%,_rgba(0,0,0,1)_70%)] py-16 px-4" id="community">
    <h2 className="text-3xl font-semibold text-center text-foreground">What Our Users Say</h2>
    <div className="mt-8 grid gap-6 lg:grid-cols-2 max-w-6xl mx-auto">
      {testimonials.map((t,idx)=>(
        <motion.figure key={idx} initial={{opacity:0, y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5, delay:0.05*idx}} className="border bg-muted/30 rounded-xl p-6 hover-lift">
          <div className="flex text-amber-500 mb-2" aria-label={`${t.rating} out of 5 stars`}>
            {Array.from({length:t.rating}).map((_,i)=>(<Star key={i} className="h-4 w-4 fill-current"/>))}
          </div>
          <blockquote className="text-sm text-foreground leading-relaxed">"{t.content}"</blockquote>
          <figcaption className="mt-3 font-medium text-foreground">{t.name}<span className="text-muted-foreground font-normal ml-2">{t.role}</span></figcaption>
        </motion.figure>
      ))}
    </div>
  </section>
  )
}

export default Testomonail;