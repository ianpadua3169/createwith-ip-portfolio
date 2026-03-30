<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20"
           @click="$emit('update:open', false)">
        <div class="w-full max-w-2xl bg-black rounded-xl neon-border overflow-hidden" @click.stop>
          <!-- Header -->
          <div class="bg-terminal-panel px-4 py-2 border-b border-terminal-green/20 flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-red-500" />
            <div class="w-3 h-3 rounded-full bg-yellow-500" />
            <div class="w-3 h-3 rounded-full bg-green-500" />
            <span class="ml-4 text-xs text-terminal-green/70 terminal-text">command-palette</span>
          </div>

          <!-- Output -->
          <div class="max-h-64 overflow-y-auto p-4 terminal-text text-sm">
            <div v-for="(line, i) in output" :key="i" class="mb-2">
              <div v-if="line.type === 'input'" class="text-terminal-cyan">{{ line.text }}</div>
              <div v-else-if="line.type === 'output'" class="text-terminal-green whitespace-pre-line">{{ line.text }}</div>
              <div v-else class="text-terminal-purple whitespace-pre-line">{{ line.text }}</div>
            </div>
          </div>

          <!-- Input -->
          <div class="flex items-center px-4 py-3 border-t border-terminal-green/20">
            <TerminalIcon class="w-4 h-4 text-terminal-cyan mr-2" />
            <input ref="inputEl" v-model="input" placeholder="Type a command..."
                   class="flex-1 bg-transparent text-terminal-green terminal-text text-sm outline-none placeholder-gray-600"
                   @keydown.enter="execute" />
          </div>

          <!-- Commands -->
          <div class="border-t border-terminal-green/20 p-2 max-h-48 overflow-y-auto">
            <div v-for="cmd in filteredCommands" :key="cmd.value"
                 class="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-terminal-green/10 transition-colors"
                 @click="executeCmd(cmd.value)">
              <component :is="cmd.icon" class="w-4 h-4 text-terminal-cyan" />
              <div>
                <div class="text-terminal-green terminal-text text-sm">{{ cmd.label }}</div>
                <div class="text-gray-400 text-xs">{{ cmd.description }}</div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-terminal-panel px-4 py-2 border-t border-terminal-green/20 text-xs text-gray-400 terminal-text">
            Press <kbd class="px-2 py-1 bg-black rounded border border-terminal-green/30 text-terminal-green">Enter</kbd> to execute
            &bull; <kbd class="px-2 py-1 bg-black rounded border border-terminal-green/30 text-terminal-green">Esc</kbd> to close
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { Terminal as TerminalIcon, Download, Mail, Github, HelpCircle } from 'lucide-vue-next'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['update:open'])

const input = ref('')
const output = ref([])
const inputEl = ref(null)

watch(() => props.open, (val) => {
  if (val) nextTick(() => inputEl.value?.focus())
})

const commands = [
  { value: 'help', label: 'help', description: 'Show available commands', icon: HelpCircle },
  { value: 'about --me', label: 'about --me', description: 'Show about info', icon: TerminalIcon },
  { value: 'projects --all', label: 'projects --all', description: 'List all projects', icon: TerminalIcon },
  { value: 'contact --email', label: 'contact --email', description: 'Show contact info', icon: Mail },
  { value: 'download --cv', label: 'download --cv', description: 'Download CV', icon: Download }
]

const filteredCommands = computed(() =>
  commands.filter(c => c.value.includes(input.value.toLowerCase()))
)

function executeCmd(cmd) {
  output.value.push({ type: 'input', text: `$ ${cmd}` })
  const responses = {
    'help': 'Available commands:\n  help - Show this help\n  about --me - Show about info\n  projects --all - List projects\n  contact --email - Show contact\n  download --cv - Download CV',
    'about --me': 'Ian Padua\nSystems & Web Developer | IT Project Manager\nLocation: Antipolo City, Rizal, Philippines\nExperience: 25+ years across PH, KSA, Mongolia\nEducation: STI (Programming) | Don Bosco (Electronics)',
    'projects --all': '1. Headless CMS Blog & Portfolio (Nuxt.js + Sanity.io)\n2. Java Library Management System (LMS)\n3. Enterprise BIR Zonal Value Plugin (WordPress)\n4. IT Curriculum & Lab Migration (Ikh Zasag, Mongolia)\n5. Integrated Security & Web Deployment\n6. Multi-Branch Fiber Optic Network Migration (KSA)\n7. Legacy Financial System Migration',
    'contact --email': 'Email: ianpadua@createwith-ip.com\nGitHub: github.com/ianpadua3169',
    'download --cv': 'CV download feature coming soon...'
  }
  output.value.push({ type: responses[cmd] ? 'output' : 'error', text: responses[cmd] || `Command not found: ${cmd}\nType 'help' for available commands` })
  input.value = ''
}

function execute() {
  if (input.value.trim()) executeCmd(input.value.trim())
}

const handleEsc = (e) => {
  if (e.key === 'Escape' && props.open) emit('update:open', false)
}

onMounted(() => window.addEventListener('keydown', handleEsc))
onUnmounted(() => window.removeEventListener('keydown', handleEsc))
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
