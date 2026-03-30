import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Github, Terminal } from 'lucide-react';
import HybridHero from '@/components/HybridHero';
import SkillNodeGraph from '@/components/SkillNodeGraph';
import CodeToResultToggle from '@/components/CodeToResultToggle';
import WorkHistoryTimeline from '@/components/WorkHistoryTimeline';
import CommandPalette from '@/components/CommandPalette';
import { useCustomCursor } from '@/hooks/useCustomCursor';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { Toaster } from '@/components/ui/sonner';

const HomePage = () => {
  const {
    setCursorState
  } = useCustomCursor();
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    helpOverlayOpen,
    setHelpOverlayOpen
  } = useKeyboardNavigation();

  useEffect(() => {
    // Add focus-visible styles globally
    const style = document.createElement('style');
    style.textContent = `
      *:focus-visible {
        outline: 2px solid hsl(var(--terminal-green));
        outline-offset: 2px;
        box-shadow: 0 0 10px hsl(var(--terminal-green) / 0.3);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return <>
      <Helmet>
        <title>Ian Padua - Systems & Web Developer | IT Project Manager</title>
        <meta name="description" content="IT Systems & Web Developer with 25+ years of experience in IT infrastructure, software engineering, and technical education. Expert in bridging legacy systems and modern web architectures." />
      </Helmet>

      <div className="min-h-screen bg-[#0A0E27]">
        {/* Hero Section */}
        <HybridHero />

        {/* Skills Section */}
        <SkillNodeGraph />

        {/* Projects Section */}
        <CodeToResultToggle />

        {/* Timeline Section */}
        <WorkHistoryTimeline />

        {/* Contact Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0F1929]">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 neon-glow">
                Get in touch
              </h2>
              <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
                Open to new opportunities in systems development, web engineering, and IT project management
              </p>

              <div className="flex flex-wrap justify-center gap-6">
							<a href="mailto:ianpadua@createwith-ip.com" className="flex items-center gap-3 px-6 py-3 bg-[#00FF41] text-black rounded-lg hover:bg-[#00FF41]/80 transition-all duration-200 active:scale-95 font-medium" onMouseEnter={() => setCursorState('terminal')} onMouseLeave={() => setCursorState('default')}>
                  <Mail className="w-5 h-5" />
                  Email
                </a>
							<a href="https://github.com/ianpadua3169" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-3 bg-[#0F1929] border border-[#00D9FF]/30 text-[#00D9FF] rounded-lg hover:bg-[#00D9FF]/10 transition-all duration-200 active:scale-95 font-medium" onMouseEnter={() => setCursorState('terminal')} onMouseLeave={() => setCursorState('default')}>
                  <Github className="w-5 h-5" />
                  GitHub
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-black border-t border-[#00FF41]/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#00FF41]" />
                <span className="text-[#00FF41] font-semibold terminal-text">Ian Padua</span>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-[#00D9FF] transition-colors duration-200">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-[#00D9FF] transition-colors duration-200">
                  Terms of Service
                </a>
              </div>
              
              <p className="text-sm text-gray-400">
                © 2026 All rights reserved
              </p>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 terminal-text">
                Press <kbd className="px-2 py-1 bg-[#0F1929] rounded border border-[#00FF41]/30 text-[#00FF41]">Ctrl+K</kbd> or <kbd className="px-2 py-1 bg-[#0F1929] rounded border border-[#00FF41]/30 text-[#00FF41]">/</kbd> to open command palette
              </p>
            </div>
          </div>
        </footer>

        {/* Command Palette */}
        <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />

        {/* Help Overlay */}
        {helpOverlayOpen && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center" onClick={() => setHelpOverlayOpen(false)}>
            <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} exit={{
          opacity: 0,
          scale: 0.9
        }} className="bg-[#0F1929] rounded-xl p-8 neon-border max-w-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-2xl font-bold text-[#00FF41] mb-6">Keyboard shortcuts</h3>
              <div className="space-y-4 terminal-text">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Open command palette</span>
                  <kbd className="px-3 py-1 bg-black rounded border border-[#00FF41]/30 text-[#00FF41]">Ctrl+K</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Alternative command palette</span>
                  <kbd className="px-3 py-1 bg-black rounded border border-[#00FF41]/30 text-[#00FF41]">/</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Show help</span>
                  <kbd className="px-3 py-1 bg-black rounded border border-[#00FF41]/30 text-[#00FF41]">?</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Navigate elements</span>
                  <kbd className="px-3 py-1 bg-black rounded border border-[#00FF41]/30 text-[#00FF41]">Tab</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Close overlays</span>
                  <kbd className="px-3 py-1 bg-black rounded border border-[#00FF41]/30 text-[#00FF41]">Esc</kbd>
                </div>
              </div>
              <button onClick={() => setHelpOverlayOpen(false)} className="mt-8 w-full px-4 py-2 bg-[#00FF41] text-black rounded-lg hover:bg-[#00FF41]/80 transition-colors duration-200 active:scale-95 font-medium">
                Close
              </button>
            </motion.div>
          </motion.div>}

        {/* Toast Notifications */}
        <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#0F1929',
          border: '1px solid rgba(0, 255, 65, 0.3)',
          color: '#00FF41'
        }
      }} />
      </div>
    </>;
};

export default HomePage;