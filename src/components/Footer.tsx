"use client";

import React, { FormEvent, useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import Script from "next/script";

import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Linkedin,
  Facebook,
  CheckIcon,
  ChevronUp,
  ChevronDown,
  Star,
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
  const [trustpilotLoaded, setTrustpilotLoaded] = useState(false);
  const ref = useRef(null);
  const trustpilotRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);

  const handleNewsLetterData = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);
    setOpenPopUp(true);
    target.reset();

    setTimeout(() => setOpenPopUp(false), 2000);
  };

  useEffect(() => {
    if (trustpilotLoaded && trustpilotRef.current) {
      // @ts-ignore
      if (window.Trustpilot) {
        // @ts-ignore
        window.Trustpilot.loadFromElement(trustpilotRef.current, true);
      }
    }
  }, [trustpilotLoaded]);

  return (
    <>
      <Script
        src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        strategy="lazyOnload"
        onLoad={() => setTrustpilotLoaded(true)}
      />

      <div
        className="relative h-full overflow-hidden sm:pt-14 pt-8 
        dark:bg-[radial-gradient(circle_at_bottom,rgba(19,50,102,1)_0%,rgba(22,23,22,1)_30%,rgba(0,0,0,1)_100%)]
        dark:text-white text-gray-600 "
        ref={container}
      >
        <div className="sm:container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row justify-between w-full gap-10 lg:gap-10">
            <div className="lg:w-1/3">
              <Link
                href="/"
                className="flex items-center mb-4 hover:opacity-90"
              >
                <Image
                  src="/taskorialogonew.png"
                  alt="Taskoria Logo"
                  width={35}
                  height={35}
                  className="rounded-md"
                />
                <span className="ml-2 text-3xl font-bold bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] bg-clip-text text-transparent">
                  Taskoria
                </span>
              </Link>

              <p className="text-gray-600 dark:text-white text-sm max-w-xs mb-6">
                Redefining How the World Hires Trusted Professionals.
              </p>

              <div className="pt-2 w-full sm:w-96">
                <p className="md:text-xl text-lg mb-3 font-semibold">
                  Become a Professional
                </p>
                <a
                  href="mailto:contact@taskoria.com"
                  className="inline-flex items-center gap-2 text-sm text-[#3C7DED] hover:text-[#41A6EE] transition-colors"
                >
                  <span className="underline">contact@taskoria.com</span>
                </a>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-2 "
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Trusted by customers worldwide
                  </p>

                  <a
                    href="https://www.trustpilot.com/review/taskoria.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block hover:opacity-80  transition-opacity"
                  >
                    <div
                      ref={trustpilotRef}
                      className="trustpilot-widget"
                      data-locale="en-au"
                      data-template-id="5419b6ffb0d04a076446a9af"
                      data-businessunit-id="69832356c5b7f0ff5cd3d39d"
                      data-style-height="24px"
                      data-style-width="100%"
                      data-theme="light"
                      data-stars="44,5"
                      data-schema-type="Organization"
                    >
                      <div className="inline-flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(4)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-[#00b67a] text-[#00b67a]"
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Excellent on Trustpilot
                        </span>
                      </div>
                    </div>
                  </a>

                  {/* Additional info */}
                  {/* <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Rated 4.8/5 based on 100+ reviews
                  </p> */}
                </motion.div>

                {openPopup && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 pt-2 text-sm flex items-center gap-2"
                  >
                    <CheckIcon className="w-4 h-4" />
                    Thanks! We received your message.
                  </motion.p>
                )}
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 gap-8 lg:gap-16 w-full lg:w-auto mt-0 lg:mt-0">
              <div className="sm:border-none">
                <h2 className="hidden sm:block text-xl pb-3 font-semibold">
                  For Customers
                </h2>

                <button
                  className="sm:hidden w-full flex justify-between items-center text-xl font-semibold border-gray-700 py-3"
                  onClick={() =>
                    setOpenSection(
                      openSection === "customers" ? "" : "customers"
                    )
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
                    className="block text-gray-600 dark:text-gray-300 hover:text-[#3C7DED] dark:hover:text-[#41A6EE] transition-colors mb-2"
                  >
                    Find Services
                  </Link>
                  <Link
                    href="/"
                    className="block text-gray-600 dark:text-gray-300 hover:text-[#3C7DED] dark:hover:text-[#41A6EE] transition-colors mb-2"
                  >
                    Community
                  </Link>
                  <Link
                    href="/"
                    className="block text-gray-600 dark:text-gray-300 hover:text-[#3C7DED] dark:hover:text-[#41A6EE] transition-colors mb-2"
                  >
                    Post a Job
                  </Link>
                  <Link
                    href="/trust-safety"
                    className="block text-gray-600 dark:text-gray-300 hover:text-[#3C7DED] dark:hover:text-[#41A6EE] transition-colors mb-2"
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
                  className="sm:hidden w-full flex justify-between items-center text-xl pb-3 font-semibold border-gray-700"
                  onClick={() =>
                    setOpenSection(
                      openSection === "providers" ? "" : "providers"
                    )
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
                    className="block text-gray-600 dark:text-gray-300 hover:text-[#3C7DED] dark:hover:text-[#41A6EE] transition-colors mb-2"
                  >
                    Join as Provider
                  </Link>
                  <Link
                    href="/"
                    className="block text-gray-600 dark:text-gray-300 hover:text-[#3C7DED] dark:hover:text-[#41A6EE] transition-colors mb-2"
                  >
                    Success Stories
                  </Link>
                  <Link
                    href="/"
                    className="block text-gray-600 dark:text-gray-300 hover:text-[#3C7DED] dark:hover:text-[#41A6EE] transition-colors mb-2"
                  >
                    Resources
                  </Link>
                  <Link
                    href="/refund-policy"
                    className="block text-gray-600 dark:text-gray-300 hover:text-[#3C7DED] dark:hover:text-[#41A6EE] transition-colors mb-2"
                  >
                    Refund Policy
                  </Link>
                </div>
              </div>

              <div className="sm:border-none">
                <h2 className="hidden sm:block text-xl pb-3 font-semibold">
                  Company
                </h2>

                <button
                  className="sm:hidden w-full flex justify-between items-center text-xl pb-1 font-semibold border-gray-700"
                  onClick={() =>
                    setOpenSection(openSection === "company" ? "" : "company")
                  }
                >
                  Company
                  <span>
                    {openSection === "company" ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </span>
                </button>

                <div
                  className={`sm:block overflow-hidden transition-all duration-300 
          ${openSection === "company" ? "max-h-40" : "max-h-0 sm:max-h-none"}`}
                >
                  <Link
                    href="/about-us"
                    className="block text-gray-600 dark:text-gray-300 hover:text-[#3C7DED] dark:hover:text-[#41A6EE] transition-colors mb-2"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/privacy-policy"
                    className="block text-gray-600 dark:text-gray-300 hover:text-[#3C7DED] dark:hover:text-[#41A6EE] transition-colors mb-2"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/careers"
                    className="block text-gray-600 dark:text-gray-300 hover:text-[#3C7DED] dark:hover:text-[#41A6EE] transition-colors mb-2"
                  >
                    Careers
                  </Link>
                  <Link
                    href="/contact"
                    className="block text-gray-600 dark:text-gray-300 hover:text-[#3C7DED] dark:hover:text-[#41A6EE] transition-colors mb-2"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/blog"
                    className="block text-gray-600 dark:text-gray-300 hover:text-[#3C7DED] dark:hover:text-[#41A6EE] transition-colors mb-2"
                  >
                    Blog
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="border-y-2 md:py-4 py-10 border-gray-700 mt-2 flex justify-center items-center">
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
            <span className="text-sm">
              &copy; {new Date().getFullYear()} Taskoria Pty Ltd. All Rights
              Reserved.{" "}
              <Link
                href="/privacy-policy"
                className="hover:text-[#3C7DED] transition-colors"
              >
                Privacy Policy
              </Link>
              {" / "}
              <Link
                href="/terms-and-conditions"
                className="hover:text-[#3C7DED] transition-colors"
              >
                Terms & Conditions
              </Link>
              {" / "}
              <Link
                href="/cookie-policy"
                className="hover:text-[#3C7DED] transition-colors"
              >
                Cookie Policy
              </Link>
              <br />
              <span className="text-xs text-gray-400">
                ABN: 658 760 831 | ACN Registered | QLD 4350, Australia |
                Proudly Australian Owned & Operated
              </span>
            </span>

            <div className="flex items-center gap-4 mr-4">
              <a
                href="https://www.instagram.com/taskoria.au/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gradient-to-br from-[#FF2847] to-[#FF6B35] hover:scale-110 rounded-full transition-transform shadow-lg"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>

              <a
                href="https://www.linkedin.com/company/taskoriaa/about/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gradient-to-br from-[#0966C2] to-[#0A66C2] hover:scale-110 rounded-full transition-transform shadow-lg"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>

              <a
                href="http://facebook.com/profile.php?id=61582506497352"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gradient-to-br from-[#0966FF] to-[#3C7DED] hover:scale-110 rounded-full transition-transform shadow-lg"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
