"use client";

import { Twitter, Linkedin, Facebook, Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* --- Brand Section --- */}
          <div>
            <Link
              href="/"
              className="flex items-center hover:opacity-90 transition-opacity"
            >
              <Image
                src="/taskorianewlogo.png"
                alt="Taskoria Logo"
                height={33}
                width={33}
                className="rounded-md"
              />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-[#3C7DED]  via-[#41A6EE] to-[#46CBEE] bg-clip-text text-transparent">
                Taskoria
              </span>
            </Link>
            <p className="text-gray-400 mt-2 text-sm">
              Redefining How the World Hires Trusted Professionals{" "}
            </p>

            {/* --- Social Icons --- */}
            <div className="flex gap-4 mt-4">
              <a
                href="https://www.instagram.com/taskoria.au/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-blue-500 transition-colors rounded-full"
              >
                <Instagram className="w-5 h-5 text-gray-300 hover:text-white" />
              </a>
              <a
                href="https://www.linkedin.com/company/taskoriaa/about/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-blue-600 transition-colors rounded-full"
              >
                <Linkedin className="w-5 h-5 text-gray-300 hover:text-white" />
              </a>
              <a
                href="http://facebook.com/profile.php?id=61582506497352"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-blue-700 transition-colors rounded-full"
              >
                <Facebook className="w-5 h-5 text-gray-300 hover:text-white" />
              </a>
            </div>
          </div>

          {/* --- For Customers --- */}
          <div>
            <h4 className="font-semibold mb-4">For Customers</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/discover"
                  className="hover:text-white transition-colors"
                >
                  Find Services
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="hover:text-white transition-colors"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/post-job"
                  className="hover:text-white transition-colors"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Trust & Safety
                </a>
              </li>
            </ul>
          </div>

          {/* --- For Providers --- */}
          <div>
            <h4 className="font-semibold mb-4">For Providers</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/become-provider"
                  className="hover:text-white transition-colors"
                >
                  Join as Provider
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Resources
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* --- Company Section --- */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* --- Bottom Section --- */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Taskoria. All rights reserved.
            <br />
            <span className="text-gray-500">
              Taskoria — A Fusion of Australian Design & Nepali Engineering.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
