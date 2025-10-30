import Link from "next/link";
import { Button } from "./ui/button";

function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#00E5FF]  via-[#6C63FF] to-[#8A2BE2] text-center text-white">
    <h2 className="text-3xl font-semibold">Ready to Experience the Future?</h2>
    <p className="opacity-90 mt-2 max-w-2xl mx-auto">Join thousands of satisfied customers and providers in our AI‑powered, secured marketplace. Start your journey today!</p>
    <div className="flex justify-center gap-3 mt-5">
      <Link href="/services">
        <Button variant="outline" className="bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20">Find Services</Button>
      </Link>
      <Link href="/providers/join">
        <Button className="bg-white text-foreground hover:bg-white/90 border-0">Become a Provider</Button>
      </Link>
    </div>
    </section>
  
  );
}

export default CTA;
