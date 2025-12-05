
"use client";

import React, { FormEvent, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin, Facebook, CheckIcon, ChevronUp, ChevronDown } from "lucide-react";


const letters = "TASKORIA".split("");
const letterPositions = [35, 75, 125, 175, 225, 275, 325, 355];

const letterVariants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: 30,
    filter: "blur(8px)",
  }),
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.15 + i * 0.08,
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  }),
};

const barVariants = {
  hidden: { width: 0, opacity: 0 },
  visible: {
    width: 360,
    opacity: 1,
    transition: {
      delay: 0.15 + letters.length * 0.08,
      duration: 0.7,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};



const Footer = () => {
  const container = useRef<HTMLDivElement>(null);
  const [openPopup, setOpenPopUp] = useState(false);
  const [openSection, setOpenSection] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref);

  const handleNewsLetterData = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);
    setOpenPopUp(true);
    target.reset();

    setTimeout(() => setOpenPopUp(false), 2000);
  };


  return (
    <div
      className="relative h-full overflow-hidden sm:pt-14 pt-8 
      bg-[radial-gradient(circle_at_bottom,rgba(19,50,102,1)_0%,rgba(22,23,22,1)_30%,rgba(0,0,0,1)_100%)]
      text-white"
      ref={container}
    >
      <div className="sm:container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row justify-between w-full gap-10 lg:gap-10">

          <div className="lg:w-1/3">
            <Link href="/" className="flex items-center mb-4 hover:opacity-90">
              <Image
                src="/taskorianewlogo.png"
                alt="Taskoria Logo"
                width={40}
                height={40}
                className="rounded-md"
              />
              <span className="ml-2 text-3xl font-bold bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] bg-clip-text text-transparent">
                Taskoria
              </span>
            </Link>

            <p className="text-gray-300 text-sm max-w-xs">
              Redefining How the World Hires Trusted Professionals.
            </p>

            <div className="pt-6 w-full sm:w-96">
              <p className="md:text-xl text-lg mb-3">
                Contact To Become Professional
              </p>
              <p className=" underline  text-sm  ">contact@taskoria.com</p>

              {/* <div className="bg-white flex justify-between items-center border-2 overflow-hidden border-white rounded-full text-black hover:text-black">
                <form
                  onSubmit={handleNewsLetterData}
                  className="grid grid-cols-6 w-full h-full"
                >
                  <input
                    type="email"
                    name="newsletter_email"
                    className="bg-transparent py-3 px-6 col-span-5 text-black placeholder-black focus:outline-none"
                    placeholder="Your Email *"
                  />
                  <button
                    type="submit"
                    className="cursor-pointer bg-white h-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      className="h-[60%] w-[60%]"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                        fill="#000"
                      />
                    </svg>
                  </button>
                </form>
              </div> */}

              {openPopup && (
                <p className="text-green-400 pt-2 text-sm">
                  Thanks! We received your message.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-16 w-full lg:w-auto mt-0 lg:mt-0">

            <div className="border-b border-gray-700 sm:border-none  sm:pb-0">

              <h2 className="hidden sm:block text-2xl pb-4 font-semibold">For Customers</h2>

              <button
                className="sm:hidden w-full flex justify-between items-center text-xl pb-3 font-semibold"
                onClick={() => setOpenSection(openSection === 'customers' ? '' : 'customers')}
              >
                For Customers
                <span>{openSection === 'customers' ? <ChevronUp/> : <ChevronDown/>}</span>
              </button>

              <ul
                className={`sm:block overflow-hidden transition-all duration-300 
      ${openSection === 'customers' ? "max-h-40" : "max-h-0 sm:max-h-none"}`}
              >
                <li className="mb-2"><Link href="/services" className="hover:text-white text-gray-300 transition-colors">Find Services</Link></li>
                <li className="mb-2"><Link href="/community" className="hover:text-white text-gray-300 transition-colors">Community</Link></li>
                <li className="mb-2"><Link href="/post-job" className="hover:text-white text-gray-300 transition-colors">Post a Job</Link></li>
                <li className="mb-2"><Link href="/trust-safety" className="hover:text-white text-gray-300 transition-colors">Trust & Safety</Link></li>
              </ul>
            </div>

            <div className="border-b border-gray-700 sm:border-none  sm:pb-0">

              <h2 className="hidden sm:block text-xl pb-3 font-semibold">For Providers</h2>

              <button
                className="sm:hidden w-full flex justify-between items-center text-xl pb-3 font-semibold"
                onClick={() => setOpenSection(openSection === 'providers' ? '' : 'providers')}
              >
                For Providers
                <span>{openSection === 'providers' ? <ChevronUp/> : <ChevronDown/>}</span>
              </button>

              <ul
                className={`sm:block overflow-hidden transition-all duration-300 
      ${openSection === 'providers' ? "max-h-40" : "max-h-0 sm:max-h-none"}`}
              >
                <li className="mb-2"><Link href="/become-provider" className="hover:text-white text-gray-300 transition-colors">Join as Provider</Link></li>
                <li className="mb-2"><a className="hover:text-white text-gray-300 transition-colors cursor-pointer">Success Stories</a></li>
                <li className="mb-2"><a className="hover:text-white text-gray-300 transition-colors cursor-pointer">Resources</a></li>
                <li className="mb-2"><a className="hover:text-white text-gray-300 transition-colors cursor-pointer">API Documentation</a></li>
              </ul>
            </div>

            <div className="border-b border-gray-700 sm:border-none pb-3 sm:pb-0">

              <h2 className="hidden sm:block text-xl pb-1 font-semibold">Company</h2>

              <button
                className="sm:hidden w-full flex justify-between items-center text-xl pb-1 font-semibold"
                onClick={() => setOpenSection(openSection === 'company' ? '' : 'company')}
              >
                Company
                <span>{openSection === 'company' ? <ChevronUp/> : <ChevronDown/>}</span>
              </button>

              <ul
                className={`sm:block overflow-hidden transition-all duration-300 
      ${openSection === 'company' ? "max-h-40" : "max-h-0 sm:max-h-none"}`}
              >
                <li className="mb-2"><Link href="/about-us" className="hover:text-white text-gray-300 transition-colors cursor-pointer">About Us</Link></li>
                <li className="mb-2"><Link href="/privacy-policy" className="hover:text-white text-gray-300 transition-colors cursor-pointer">Privacy Policy</Link></li>
                <li className="mb-2"><a className="hover:text-white text-gray-300 transition-colors cursor-pointer">Press</a></li>
                <li className="mb-2"><a className="hover:text-white text-gray-300 transition-colors cursor-pointer">Contact</a></li>
              </ul>
            </div>

          </div>
        </div>

        <div className="border-y-2 md:py-4 py-10 border-gray-700 mt-10 flex justify-center items-center">
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 420 100"
            className="w-full max-w-3xl h-auto"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            ref={ref}
          >
            <defs>
              <linearGradient
                id="taskoriaFooterGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#3C7DED" />
                <stop offset="50%" stopColor="#41A6EE" />
                <stop offset="100%" stopColor="#46CBEE" />
              </linearGradient>

              <filter id="taskoriaGlow" x="-20%" y="-50%" width="140%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="
                    0 0 0 0 0.24
                    0 0 0 0 0.49
                    0 0 0 0 0.93
                    0 0 0 0.7 0
                  "
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {letters.map((letter, i) => (
              <motion.text
                key={i}
                custom={i}
                variants={letterVariants}
                x={letterPositions[i]}
                y={70}
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif"
                fontSize="68"
                fontWeight="700"
                fill="url(#taskoriaFooterGradient)"
                filter="url(#taskoriaGlow)"
                letterSpacing="0.05em"
              >
                {letter}
              </motion.text>
            ))}

            {/* <motion.rect
              x={44}
              y={70}
              height={4}
              rx={4}
              fill="url(#taskoriaFooterGradient)"
              variants={barVariants}
              style={{ width: 360 }}
            /> */}
          </motion.svg>
        </div>

        <div className="flex md:flex-row flex-col gap-3 justify-between py-6 text-gray-300">
          <span className="font-medium">
            &copy; {new Date().getFullYear()} Taskoria. All Rights Reserved. <Link href="/privacy-policy" className="   underline">Privacy Policy.</Link>
            <br />
            <span className="text-gray-400">
              ABN: 658 760 831 | GST Registered | QLD 4350, Australia | Proudly Australian Owned & Operated
            </span>
          </span>

          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/taskoria.au/"
              target="_blank"
              className="p-2 bg-gray-800 hover:bg-blue-500 rounded-full"
            >
              <Instagram className="w-5 h-5 text-gray-300 hover:text-white" />
            </a>

            <a
              href="https://www.linkedin.com/company/taskoriaa/about/"
              target="_blank"
              className="p-2 bg-gray-800 hover:bg-blue-600 rounded-full"
            >
              <Linkedin className="w-5 h-5 text-gray-300 hover:text-white" />
            </a>

            <a
              href="http://facebook.com/profile.php?id=61582506497352"
              target="_blank"
              className="p-2 bg-gray-800 hover:bg-blue-700 rounded-full"
            >
              <Facebook className="w-5 h-5 text-gray-300 hover:text-white" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
