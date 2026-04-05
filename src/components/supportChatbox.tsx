"use client";
import { motion } from "motion/react";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "61474655902";

export default function WhatsAppSupportButton() {
  const message = "Hi, I need support regarding your service.";

  const handleWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <style jsx>{`
        @keyframes wave {
          0% { transform: rotate(0deg); }
          15% { transform: rotate(14deg); }
          30% { transform: rotate(-8deg); }
          40% { transform: rotate(14deg); }
          50% { transform: rotate(-4deg); }
          60% { transform: rotate(10deg); }
          70% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-wave {
          display: inline-block;
          transform-origin: 70% 70%;
          animation: wave 1.5s infinite;
        }
      `}</style>

      <motion.a
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-17 right-4 flex items-center gap-2 bg-[#25D366] p-2 md:p-1.5 rounded-lg shadow-lg z-50 transition-transform duration-300"
        aria-label="Chat on WhatsApp"
      >
        <div className="flex items-center justify-center  rounded-lg">
          <FaWhatsapp className="text-white h-6 w-6 md:h-8.5 md:w-8.5 " />
        </div>
        <div className="flex items-center gap-1 text-black  text-sm md:text-sm">
          Chat Now <span className="animate-wave">👋</span>
        </div>
      </motion.a>
    </>
  );
}