
import Link from "next/link"
import { Button } from "./ui/button"


function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">Ready to Experience the Future?</h2>
            <p className="text-xl text-blue-100">
              Join thousands of satisfied customers and providers in our AI-powered, blockchain-secured marketplace
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4" asChild>
                <Link href="/en/discover">Find Services</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-gray-950 hover:bg-white hover:text-blue-600" asChild>
                <Link href="/en/create">Become a Provider</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

  )
}

export default CTA