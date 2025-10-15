import { Zap } from "lucide-react"
import Link from "next/link"


function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Taskoria</span>
          </div>
          <p className="text-gray-400 text-sm">
            The next-generation service marketplace powered by AI and secured by blockchain technology.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">For Customers</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/discover" className="hover:text-white transition-colors">Find Services</Link></li>
            <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
            <li><Link href="/post-job" className="hover:text-white transition-colors">Post a Job</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Trust & Safety</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">For Providers</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/become-provider" className="hover:text-white transition-colors">Join as Provider</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
            <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} Taskoria. All rights reserved. Powered by AI • Secured by Blockchain • Driven by Community</p>
      </div>
    </div>
  </footer>
  )
}

export default Footer