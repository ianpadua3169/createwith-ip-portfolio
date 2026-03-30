import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Eye } from 'lucide-react';

const CodeToResultToggle = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const project = {
    title: 'Headless CMS Blog & Portfolio',
    resultImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    code: `// Nuxt.js + Sanity.io JAMstack Architecture
// GROQ query for fetching blog posts
const query = groq\`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    "author": author->name,
    "categories": categories[]->title,
    "mainImage": mainImage.asset->url,
    body
  }
\`;

// Server-side rendering with Nuxt.js
export default defineNuxtConfig({
  modules: ['@nuxtjs/sanity'],
  sanity: {
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: 'production',
    useCdn: true,
    apiVersion: '2024-01-01'
  }
});

// Image CDN delivery with optimized loading
const imageUrl = urlFor(post.mainImage)
  .width(800)
  .height(400)
  .format('webp')
  .url();`
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0F1929]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-glow">
            From code to production
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Drag the slider to explore the implementation
          </p>
        </motion.div>

        <div
          className="relative w-full h-[600px] bg-black rounded-2xl neon-border overflow-hidden cursor-col-resize"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Result Side */}
          <div
            className="absolute inset-0 flex items-center justify-center p-8"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <div className="w-full h-full relative">
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-[#00D9FF]/30">
                <Eye className="w-4 h-4 text-[#00D9FF]" />
                <span className="text-sm text-[#00D9FF] font-medium">Result</span>
              </div>
              <img
                src={project.resultImage}
                alt={project.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Code Side */}
          <div
            className="absolute inset-0 bg-black p-8"
            style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
          >
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#00FF41]/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-[#00FF41]/30">
              <Code2 className="w-4 h-4 text-[#00FF41]" />
              <span className="text-sm text-[#00FF41] font-medium">Code</span>
            </div>
            <pre className="terminal-text text-sm text-[#00FF41] leading-relaxed overflow-auto h-full pt-16">
              <code>{project.code}</code>
            </pre>
          </div>

          {/* Slider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-[#00D9FF] cursor-col-resize z-10"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#00D9FF] rounded-full shadow-lg shadow-[#00D9FF]/50 flex items-center justify-center">
              <div className="w-1 h-4 bg-black rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeToResultToggle;