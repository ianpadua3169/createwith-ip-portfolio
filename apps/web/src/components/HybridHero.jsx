import React from 'react';
import { motion } from 'framer-motion';
import TerminalSimulator from './TerminalSimulator';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';
const HybridHero = () => {
  const featuredProjects = [{
    title: 'Headless CMS Blog & Portfolio',
    description: 'High-performance, SEO-optimized blog and portfolio using a decoupled JAMstack architecture with server-side rendering and static site generation for near-instantaneous navigation.',
    tech: ['Nuxt.js', 'Sanity.io', 'GROQ', 'Tailwind CSS'],
    image: 'https://images.unsplash.com/photo-1698216605861-54f2bce18350',
    github: '#',
    demo: 'https://nuxtsanityfrontend.vercel.app/'
  }, {
    title: 'Java Library Management System',
    description: 'Comprehensive desktop application for automated book tracking, member registration, and circulation management with real-time availability tracking and automated fine calculation.',
    tech: ['Java', 'Swing', 'JDBC', 'MySQL'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    github: '#',
    demo: '#'
  }];
  return <section className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Terminal */}
      <div className="relative bg-black border-r border-[#00FF41]/20 flex items-center justify-center p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FF41]/5 to-transparent pointer-events-none"></div>
        <div className="w-full max-w-2xl h-[600px] neon-border rounded-xl overflow-hidden relative z-10">
          <div className="bg-black/50 backdrop-blur-sm px-4 py-2 border-b border-[#00FF41]/20 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-xs text-[#00FF41]/70 terminal-text">system@portfolio:~$</span>
          </div>
          <TerminalSimulator />
        </div>
      </div>

      {/* Right Side - Project Showcase */}
      <div className="relative bg-[#0A0E27] flex items-center justify-center p-8 lg:p-12">
        <div className="absolute inset-0 bg-gradient-to-bl from-[#00D9FF]/5 to-transparent pointer-events-none"></div>
        <div className="w-full max-w-2xl space-y-8 relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <h1 className="text-5xl lg:text-6xl font-bold mb-4 neon-glow" style={{
            letterSpacing: '-0.02em'
          }}>
              Ian Padua
            </h1>
            <p className="text-xl text-[#00D9FF] mb-6">
              Systems & Web Developer | IT Project Manager
            </p>
            <p className="text-base text-gray-400 leading-relaxed max-w-prose">
              25+ years bridging legacy systems (COBOL, FoxPro) and modern web architectures (JavaScript, Python, Java). Specializing in end-to-end system design, network security, and database management across the Middle East, Mongolia, and the Philippines.
            </p>
          </motion.div>

          <div className="space-y-6">
            {featuredProjects.map((project, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.2 + index * 0.1
          }} className="bg-[#0F1929] rounded-xl p-6 neon-border-blue hover:shadow-lg hover:shadow-[#00D9FF]/10 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-[#00D9FF]">{project.title}</h3>
                  <div className="flex gap-2">
                    <a href={project.github} className="text-gray-400 hover:text-[#00FF41] transition-colors duration-200" aria-label="View on GitHub">
                      <Github className="w-5 h-5" />
                    </a>
                    <a href={project.demo} className="text-gray-400 hover:text-[#00D9FF] transition-colors duration-200" aria-label="View live demo">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => <Badge key={techIndex} variant="outline" className="border-[#00FF41]/30 text-[#00FF41] text-xs">
                      {tech}
                    </Badge>)}
                </div>
              </motion.div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default HybridHero;