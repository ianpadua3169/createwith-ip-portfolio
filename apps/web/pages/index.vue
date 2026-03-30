<template>
  <div class="min-h-screen bg-terminal-dark">
    <HybridHero />
    <SkillNodeGraph />
    <CodeToResultToggle />
    <WorkHistoryTimeline />

    <!-- Contact Section -->
    <section class="py-24 px-4 sm:px-6 lg:px-8 bg-terminal-panel">
      <div class="max-w-7xl mx-auto">
        <div class="text-center animate-fade-in-up">
          <h2 class="text-4xl md:text-5xl font-bold mb-8 neon-glow">Get in touch</h2>
          <p class="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Open to new opportunities in systems development, web engineering, and IT project management
          </p>
          <div class="flex flex-wrap justify-center gap-6">
            <a href="mailto:ianpadua@createwith-ip.com"
               class="flex items-center gap-3 px-6 py-3 bg-terminal-green text-black rounded-lg hover:bg-terminal-green/80 transition-all duration-200 active:scale-95 font-medium">
              <Mail class="w-5 h-5" />
              Email
            </a>
            <a href="https://github.com/ianpadua3169" target="_blank" rel="noopener noreferrer"
               class="flex items-center gap-3 px-6 py-3 bg-terminal-panel border border-terminal-cyan/30 text-terminal-cyan rounded-lg hover:bg-terminal-cyan/10 transition-all duration-200 active:scale-95 font-medium">
              <Github class="w-5 h-5" />
              GitHub
            </a>
            <a href="/Ian-Padua-CV.pdf" download
               class="flex items-center gap-3 px-6 py-3 bg-terminal-panel border border-terminal-purple/30 text-terminal-purple rounded-lg hover:bg-terminal-purple/10 transition-all duration-200 active:scale-95 font-medium">
              <Download class="w-5 h-5" />
              Download CV
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 px-4 sm:px-6 lg:px-8 bg-black border-t border-terminal-green/20">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-2">
            <Terminal class="w-5 h-5 text-terminal-green" />
            <span class="text-terminal-green font-semibold terminal-text">Ian Padua</span>
          </div>
          <p class="text-sm text-gray-400">&copy; 2026 All rights reserved</p>
        </div>
      </div>
    </footer>

    <CommandPalette v-model:open="commandPaletteOpen" />
  </div>
</template>

<script setup>
import { Mail, Github, Terminal, Download } from 'lucide-vue-next'

const commandPaletteOpen = ref(false)

const handleKeydown = (e) => {
  if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && e.target.tagName !== 'INPUT')) {
    e.preventDefault()
    commandPaletteOpen.value = true
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
