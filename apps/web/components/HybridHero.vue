<template>
  <section class="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
    <!-- Left Side - Terminal -->
    <div class="relative bg-black border-r border-terminal-green/20 flex items-center justify-center p-8">
      <div class="absolute inset-0 bg-gradient-to-br from-terminal-green/5 to-transparent pointer-events-none" />
      <div class="w-full max-w-2xl h-[600px] neon-border rounded-xl overflow-hidden relative z-10">
        <div class="bg-black/50 backdrop-blur-sm px-4 py-2 border-b border-terminal-green/20 flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-red-500" />
          <div class="w-3 h-3 rounded-full bg-yellow-500" />
          <div class="w-3 h-3 rounded-full bg-green-500" />
          <span class="ml-4 text-xs text-terminal-green/70 terminal-text">system@portfolio:~$</span>
        </div>
        <TerminalSimulator />
      </div>
    </div>

    <!-- Right Side - Project Showcase -->
    <div class="relative bg-terminal-dark flex items-center justify-center p-8 lg:p-12">
      <div class="absolute inset-0 bg-gradient-to-bl from-terminal-cyan/5 to-transparent pointer-events-none" />
      <div class="w-full max-w-2xl space-y-8 relative z-10">
        <div class="animate-fade-in-up">
          <div class="mb-5">
            <MarqueeLogo />
          </div>
          <h1 class="text-5xl lg:text-6xl font-bold mb-4 neon-glow" style="letter-spacing: -0.02em">
            Ian Padua
          </h1>
          <p class="text-xl text-terminal-cyan mb-6">
            Systems &amp; Web Developer | IT Project Manager
          </p>
          <p class="text-base text-gray-400 leading-relaxed max-w-prose">
            25+ years bridging legacy systems (COBOL, FoxPro) and modern web architectures
            (JavaScript, Python, Java). Specializing in end-to-end system design, network security,
            and database management across the Middle East, Mongolia, and the Philippines.
          </p>
        </div>

        <div class="space-y-6">
          <div v-for="(project, index) in featuredProjects" :key="index"
               class="bg-terminal-panel rounded-xl p-6 neon-border-blue hover:shadow-lg hover:shadow-terminal-cyan/10 transition-all duration-300 animate-fade-in-up"
               :style="{ animationDelay: `${0.2 + index * 0.1}s`, opacity: 0 }">
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-xl font-semibold text-terminal-cyan">{{ project.title }}</h3>
              <div class="flex gap-2">
                <a :href="project.github" class="text-gray-400 hover:text-terminal-green transition-colors duration-200">
                  <GithubIcon class="w-5 h-5" />
                </a>
                <a :href="project.demo" class="text-gray-400 hover:text-terminal-cyan transition-colors duration-200">
                  <ExternalLink class="w-5 h-5" />
                </a>
              </div>
            </div>
            <p class="text-sm text-gray-400 mb-4 leading-relaxed">{{ project.description }}</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="tech in project.tech" :key="tech"
                    class="text-xs px-2 py-1 rounded border border-terminal-green/30 text-terminal-green">
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Github as GithubIcon, ExternalLink } from 'lucide-vue-next'

const featuredProjects = [
  {
    title: 'Headless CMS Blog & Portfolio',
    description: 'High-performance, SEO-optimized blog and portfolio using a decoupled JAMstack architecture with server-side rendering and static site generation for near-instantaneous navigation.',
    tech: ['Nuxt.js', 'Sanity.io', 'GROQ', 'Tailwind CSS'],
    github: '#',
    demo: 'https://nuxtsanityfrontend.vercel.app/'
  },
  {
    title: 'Java Library Management System',
    description: 'Comprehensive desktop application for automated book tracking, member registration, and circulation management with real-time availability tracking and automated fine calculation.',
    tech: ['Java', 'Swing', 'JDBC', 'MySQL'],
    github: '#',
    demo: '#'
  }
]
</script>
