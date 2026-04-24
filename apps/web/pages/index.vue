<template>
  <div class="min-h-screen bg-terminal-dark">
    <HybridHero />
    <SkillNodeGraph />
    <CodeToResultToggle />
    <WorkHistoryTimeline />
    <BlogPreview />

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
            <a :href="cvHref" download="Ian-Padua-CV.pdf"
               class="flex items-center gap-3 px-6 py-3 bg-terminal-panel border border-terminal-purple/30 text-terminal-purple rounded-lg hover:bg-terminal-purple/10 transition-all duration-200 active:scale-95 font-medium"
               @click.prevent="onCvDownloadClick">
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
          <div class="flex flex-wrap items-center gap-3 justify-center md:justify-start">
            <MarqueeLogo compact class="shrink-0" />
            <div class="flex items-center gap-2">
              <Terminal class="w-5 h-5 text-terminal-green" />
              <span class="text-terminal-green font-semibold terminal-text">Ian Padua</span>
            </div>
          </div>
          <p class="text-sm text-gray-400">&copy; 2026 All rights reserved</p>
        </div>
        <p class="mt-8 text-center text-xs text-gray-500 terminal-text leading-relaxed hidden xl:block xl:pointer-coarse:hidden">
          <span class="text-gray-400">Terminal commands</span>
          — press
          <kbd class="ml-1.5 px-2 py-0.5 bg-terminal-panel rounded border border-terminal-green/30 text-terminal-green font-mono text-[0.7rem]">Ctrl</kbd><span class="mx-0.5 text-gray-600">+</span><kbd class="px-2 py-0.5 bg-terminal-panel rounded border border-terminal-green/30 text-terminal-green font-mono text-[0.7rem]">K</kbd>
          <span class="mx-1.5 text-gray-600">or</span>
          <kbd class="px-2 py-0.5 bg-terminal-panel rounded border border-terminal-green/30 text-terminal-green font-mono text-[0.7rem]">⌘</kbd><span class="mx-0.5 text-gray-600">+</span><kbd class="px-2 py-0.5 bg-terminal-panel rounded border border-terminal-green/30 text-terminal-green font-mono text-[0.7rem]">K</kbd>
          <span class="mx-1.5 text-gray-600">or</span>
          <kbd class="px-2 py-0.5 bg-terminal-panel rounded border border-terminal-green/30 text-terminal-green font-mono text-[0.7rem]">/</kbd>
          <span class="ml-1.5">to open the command palette.</span>
        </p>
        <div class="mt-8 flex flex-col items-center gap-3 xl:hidden xl:pointer-coarse:flex">
          <button type="button"
                  class="touch-manipulation select-none px-5 py-3 rounded-xl border-2 border-terminal-green/50 bg-terminal-panel text-terminal-green text-sm font-medium terminal-text active:scale-95 transition-transform w-full max-w-xs"
                  @click="commandPaletteOpen = true">
            Open command palette
          </button>
          <p class="text-center text-[0.65rem] text-gray-600 terminal-text px-2 max-w-md">
            Run <span class="text-terminal-cyan">play --tetris</span> or <span class="text-terminal-cyan">play --pacman</span>. Use the on-screen controls in-game on phones and tablets (arrow keys if you have a keyboard).
          </p>
          <p class="text-center text-[0.65rem] text-gray-500 terminal-text px-2">
            With a keyboard: <kbd class="px-1.5 py-0.5 bg-terminal-panel rounded border border-terminal-green/30 text-terminal-green font-mono text-[0.65rem]">⌘</kbd>/<kbd class="px-1.5 py-0.5 bg-terminal-panel rounded border border-terminal-green/30 text-terminal-green font-mono text-[0.65rem]">Ctrl</kbd>+<kbd class="px-1.5 py-0.5 bg-terminal-panel rounded border border-terminal-green/30 text-terminal-green font-mono text-[0.65rem]">K</kbd> or <kbd class="px-1.5 py-0.5 bg-terminal-panel rounded border border-terminal-green/30 text-terminal-green font-mono text-[0.65rem]">/</kbd>
          </p>
        </div>
        <div class="mt-6 hidden xl:block xl:pointer-coarse:hidden text-center text-[0.65rem] text-gray-600 terminal-text">
          Games: <span class="text-terminal-cyan">play --tetris</span>, <span class="text-terminal-cyan">play --pacman</span>
        </div>
      </div>
    </footer>

    <CommandPalette v-model:open="commandPaletteOpen" />
  </div>
</template>

<script setup>
import { Mail, Github, Terminal, Download } from 'lucide-vue-next'

const commandPaletteOpen = ref(false)
const { cvHref, downloadAsFile } = useCvDownload()

async function onCvDownloadClick() {
  const ok = await downloadAsFile()
  if (!ok) window.location.assign(cvHref.value)
}

const handleKeydown = (e) => {
  const tag = e.target?.tagName
  const typing = tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable
  const paletteKey = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'
  const slash = e.key === '/' && !typing
  if (paletteKey || slash) {
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
