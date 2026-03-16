"use client";

import { motion } from "motion/react";

export default function ServiceContent({ html }: { html: string }) {
  return (
    <section className="py-10">
      <div className="max-w-4xl mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="
            prose
            prose-lg
            max-w-none
            prose-headings:font-bold
            prose-h2:text-3xl
            prose-h3:text-xl
            prose-h2:mt-12
            prose-h3:mt-8
            prose-p:text-gray-600
            prose-li:text-gray-600
            prose-strong:text-gray-900
            dark:prose-invert
          "
          dangerouslySetInnerHTML={{ __html: html }}
        />

      </div>
    </section>
  );
}