"use client";

import React, { FormEvent, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Linkedin,
  Facebook,
  CheckIcon,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

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
      dark:bg-[radial-gradient(circle_at_bottom,rgba(19,50,102,1)_0%,rgba(22,23,22,1)_30%,rgba(0,0,0,1)_100%)]
      dark:text-white text-gray-600 "
      ref={container}
    >
      <div className="sm:container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row justify-between w-full gap-10 lg:gap-10">
          <div className="lg:w-1/3">
            <Link href="/" className="flex items-center mb-4 hover:opacity-90">
              <Image
                src="/taskorialogonew.png"
                alt="Taskoria Logo"
                width={35}
                height={35}
                className="rounded-md"
              />
              <span className="ml- text-3xl font-bold bg-[#3C7DED] bg-clip-text text-transparent">
                Taskoria
              </span>
            </Link>

            <p className="text-gray-600 dark:text-white text-sm max-w-xs">
              Redefining How the World Hires Trusted Professionals.
            </p>

            <div className="pt-6 w-full sm:w-96">
              <p className="md:text-xl text-lg mb-3">
                Contact To Become Professional
              </p>
              <p className="underline text-sm">contact@taskoria.com</p>

              {openPopup && (
                <p className="text-green-400 pt-2 text-sm">
                  Thanks! We received your message.
                </p>
              )}
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 gap-8 lg:gap-16 w-full lg:w-auto mt-0 lg:mt-0">
            <div className="sm:border-none">
              <h2 className="hidden sm:block text-2xl pb-3 font-semibold">
                For Customers
              </h2>

              <button
                className="sm:hidden w-full flex justify-between items-center text-xl  font-semibold  border-gray-700"
                onClick={() =>
                  setOpenSection(openSection === "customers" ? "" : "customers")
                }
              >
                For Customers
                <span>
                  {openSection === "customers" ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </span>
              </button>

              <div
                className={`sm:block overflow-hidden transition-all duration-300 
        ${openSection === "customers" ? "max-h-40" : "max-h-0 sm:max-h-none"}`}
              >
                <Link
                  href="/services"
                  className="block text-gray-600 dark:text-white hover:text-gray-900   mb-2"
                >
                  Find Services
                </Link>
                <Link
                  href="/"
                  className="block text-gray-600 dark:text-white hover:text-gray-900   mb-2"
                >
                  Community
                </Link>
                <Link
                  href="/"
                  className="block text-gray-600 dark:text-white hover:text-gray-900   mb-2"
                >
                  Post a Job
                </Link>
                <Link
                  href="/trust-safety"
                  className="block text-gray-600 dark:text-white hover:text-gray-900   mb-2"
                >
                  Trust & Safety
                </Link>
              </div>
            </div>

            <div className="sm:border-none">
              <h2 className="hidden sm:block text-xl pb-3 font-semibold">
                For Providers
              </h2>

              <button
                className="sm:hidden w-full flex justify-between items-center text-xl pb-3 font-semibold  border-gray-700"
                onClick={() =>
                  setOpenSection(openSection === "providers" ? "" : "providers")
                }
              >
                For Providers
                <span>
                  {openSection === "providers" ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </span>
              </button>

              <div
                className={`sm:block overflow-hidden transition-all duration-300 
        ${openSection === "providers" ? "max-h-40" : "max-h-0 sm:max-h-none"}`}
              >
                <Link
                  href="/"
                  className="block text-gray-600 dark:text-white hover:text-gray-900   mb-2"
                >
                  Join as Provider
                </Link>
                <a
                  href="/"
                  className="block  text-gray-600 dark:text-white hover:text-gray-900   mb-2 cursor-pointer"
                >
                  Success Stories
                </a>
                <a
                  href="/"
                  className="block text-gray-600 dark:text-white hover:text-gray-900   mb-2 cursor-pointer"
                >
                  Resources
                </a>
                <a
                  href="/"
                  className="block text-gray-600 dark:text-white hover:text-gray-900   mb-2 cursor-pointer"
                >
                  API Documentation
                </a>
              </div>
            </div>

            <div className="sm:border-none">
              <h2 className="hidden sm:block text-xl pb-3 font-semibold">
                Company
              </h2>

              <button
                className="sm:hidden w-full flex justify-between items-center text-xl pb-1 font-semibold  border-gray-700"
                onClick={() =>
                  setOpenSection(openSection === "company" ? "" : "company")
                }
              >
                Company
                <span>
                  {openSection === "company" ? <ChevronUp /> : <ChevronDown />}
                </span>
              </button>

              <div
                className={`sm:block overflow-hidden transition-all duration-300 
        ${openSection === "company" ? "max-h-40" : "max-h-0 sm:max-h-none"}`}
              >
                <Link
                  href="/about-us"
                  className="block text-gray-600 dark:text-white hover:text-gray-900   mb-2"
                >
                  About Us
                </Link>
                <Link
                  href="/privacy-policy"
                  className="block text-gray-600 dark:text-white hover:text-gray-900   mb-2"
                >
                  Privacy Policy
                </Link>
                <a
                  href="/careers"
                  className="block text-gray-600 dark:text-white hover:text-gray-900   mb-2 cursor-pointer"
                >
                  Careers
                </a>
                <a
                  href="/contact"
                  className="block text-gray-600 dark:text-white hover:text-gray-900   mb-2 cursor-pointer"
                >
                  Contact
                </a>
                <a
                  href="/blogs"
                  className="block text-gray-600 dark:text-white hover:text-gray-900   mb-2 cursor-pointer"
                >
                  Blogs
                </a>
              </div>
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

              <filter
                id="taskoriaGlow"
                x="-20%"
                y="-50%"
                width="140%"
                height="200%"
              >
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="2.5"
                  result="blur"
                />
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
          </motion.svg>
        </div>

        <div className="flex md:flex-row flex-col gap-3 justify-between py-6 text-gray-600 dark:text-gray-300">
          <span className="font-medium">
            &copy; {new Date().getFullYear()} Taskoria Pty Ltd. All Rights
            Reserved.{" "}
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            {" "}/{" "}
            <Link href="/terms-and-conditions" className="hover:underline">
              Terms & Conditions
            </Link>
            {" "} /{" "}
            <Link href="/cookie-policy" className="hover:underline">
               Cookie Policy
            </Link>
            <br />
            <span className="text-gray-400">
              ABN: 658 760 831 | ACN Registered | QLD 4350, Australia | Proudly
              Australian Owned & Operated
            </span>
          </span>

          <div className="flex items-center gap-4 mr-4">
            <a
              href="https://www.instagram.com/taskoria.au/"
              target="_blank"
              className="p-2 bg-[#FF2847] hover:bg-black rounded-full transition-colors"
            >
              <Instagram className="w-5 h-5 text-white  hover:text-[#FF2847]" />
            </a>

            <a
              href="https://www.linkedin.com/company/taskoriaa/about/"
              target="_blank"
              className="p-2  bg-[#0966C2] hover:bg-blue-600 rounded-full transition-colors"
            >
              <Linkedin className="w-5 h-5 dark:text-gray-300  text-white  hover:text-white " />
            </a>

            <a
              href="http://facebook.com/profile.php?id=61582506497352"
              target="_blank"
              className="p-2 bg-[#0966FF] hover:bg-black rounded-full transition-colors"
            >
              <Facebook className="w-5 h-5 text-white hover:text-[#0966FF]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
