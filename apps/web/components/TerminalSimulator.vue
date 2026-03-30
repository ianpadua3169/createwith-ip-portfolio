<template>
  <div class="h-full w-full bg-black p-6 overflow-hidden">
    <div class="terminal-text text-terminal-green text-sm leading-relaxed">
      <div v-for="(line, i) in visibleLines" :key="i" class="mb-2 animate-fade-in-up">
        <span class="text-terminal-cyan">$</span> {{ line }}
      </div>
      <div v-if="!isComplete" class="flex items-center mt-2">
        <span class="text-terminal-cyan">$</span>
        <span class="ml-2 inline-block w-2 h-4 bg-terminal-green animate-blink" />
      </div>
      <div v-if="isComplete" class="mt-4 text-terminal-purple animate-fade-in-up">
        <span class="text-terminal-cyan">$</span> Ready for input_
      </div>
    </div>
  </div>
</template>

<script setup>
const bootSequence = [
  { text: 'Initializing system...', delay: 400 },
  { text: 'Loading profile: Ian Padua', delay: 600 },
  { text: 'Role: Systems & Web Developer | IT Project Manager', delay: 500 },
  { text: 'Experience: 25+ years across PH, KSA, Mongolia', delay: 700 },
  { text: 'Skills: Python, Java, JS, PHP, SQL, C++, VB', delay: 600 },
  { text: 'Infra: Windows Server, Linux, Cisco, Fiber Optic', delay: 600 },
  { text: 'Web: Nuxt.js, Sanity.io, Tailwind, WordPress', delay: 500 },
  { text: 'Certs: Java NC III, 120-Hr TEFL, Grapeseed', delay: 500 },
  { text: 'Education: STI (Programming) | Don Bosco (Electronics)', delay: 600 },
  { text: 'Portfolio loaded. System ready.', delay: 400 }
]

const visibleLines = ref([])
const isComplete = ref(false)
let currentIndex = 0

function showNextLine() {
  if (currentIndex < bootSequence.length) {
    setTimeout(() => {
      visibleLines.value.push(bootSequence[currentIndex].text)
      currentIndex++
      showNextLine()
    }, bootSequence[currentIndex].delay)
  } else {
    isComplete.value = true
  }
}

onMounted(() => {
  showNextLine()
})
</script>
