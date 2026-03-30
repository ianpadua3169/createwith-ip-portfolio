<template>
  <section class="py-24 px-4 sm:px-6 lg:px-8 bg-terminal-panel">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="text-4xl md:text-5xl font-bold mb-4 neon-glow">From code to production</h2>
        <p class="text-lg text-gray-400 max-w-2xl mx-auto">Drag the slider to explore the implementation</p>
      </div>

      <div class="relative w-full h-[600px] bg-black rounded-2xl neon-border overflow-hidden cursor-col-resize select-none"
           @mousemove="onMouseMove" @mousedown="isDragging = true"
           @mouseup="isDragging = false" @mouseleave="isDragging = false">
        <!-- Result Side -->
        <div class="absolute inset-0 flex items-center justify-center p-8"
             :style="{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }">
          <div class="w-full h-full relative">
            <div class="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-terminal-cyan/30 z-10">
              <Eye class="w-4 h-4 text-terminal-cyan" />
              <span class="text-sm text-terminal-cyan font-medium">Result</span>
            </div>
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71" alt="Headless CMS Blog & Portfolio"
                 class="w-full h-full object-cover rounded-lg" />
          </div>
        </div>

        <!-- Code Side -->
        <div class="absolute inset-0 bg-black p-8"
             :style="{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }">
          <div class="absolute top-4 right-4 flex items-center gap-2 bg-terminal-green/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-terminal-green/30 z-10">
            <Code2 class="w-4 h-4 text-terminal-green" />
            <span class="text-sm text-terminal-green font-medium">Code</span>
          </div>
          <pre class="terminal-text text-sm text-terminal-green leading-relaxed overflow-auto h-full pt-16"><code>{{ codeSnippet }}</code></pre>
        </div>

        <!-- Slider Handle -->
        <div class="absolute top-0 bottom-0 w-1 bg-terminal-cyan z-10" :style="{ left: `${sliderPosition}%` }">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-terminal-cyan rounded-full shadow-lg shadow-terminal-cyan/50 flex items-center justify-center">
            <div class="w-1 h-4 bg-black rounded-full" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Eye, Code2 } from 'lucide-vue-next'

const sliderPosition = ref(50)
const isDragging = ref(false)

const codeSnippet = `// Nuxt.js + Sanity.io JAMstack Architecture
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

const onMouseMove = (e) => {
  if (!isDragging.value) return
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  sliderPosition.value = Math.max(0, Math.min(100, (x / rect.width) * 100))
}
</script>
