<template>
  <section class="py-24 px-4 sm:px-6 lg:px-8 bg-terminal-dark">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="text-4xl md:text-5xl font-bold mb-4 neon-glow-purple">Project timeline</h2>
        <p class="text-lg text-gray-400 max-w-2xl mx-auto">Contribution history and project durations</p>
      </div>

      <!-- Contribution Graph -->
      <div class="mb-16">
        <h3 class="text-xl font-semibold text-terminal-cyan mb-6">Activity overview</h3>
        <div class="bg-black/30 rounded-xl p-6 neon-border overflow-x-auto">
          <div class="flex gap-1">
            <div v-for="(week, wi) in contributionData" :key="wi" class="flex flex-col gap-1">
              <div v-for="(intensity, di) in week" :key="di"
                   class="w-3 h-3 rounded-sm transition-all duration-200 hover:scale-125"
                   :style="{ backgroundColor: getIntensityColor(intensity) }"
                   :title="intensity === 0 ? 'No activity' : `${intensity} contributions`" />
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div>
        <h3 class="text-xl font-semibold text-terminal-cyan mb-6">Project durations</h3>
        <div class="space-y-6">
          <div v-for="(project, index) in projects" :key="project.id" class="relative animate-fade-in-up"
               :style="{ animationDelay: `${index * 0.1}s`, opacity: 0 }"
               @mouseenter="hoveredProject = project.id" @mouseleave="hoveredProject = null">
            <div class="flex items-center gap-4 mb-2">
              <span class="text-sm text-gray-400 w-32">{{ project.start }}</span>
              <div class="flex-1 h-12 bg-black/30 rounded-lg relative overflow-hidden">
                <div class="absolute inset-y-0 left-0 rounded-lg flex items-center px-4 transition-opacity duration-200"
                     :style="{
                       width: `${Math.max(15, Math.min(100, (project.duration / 252) * 100))}%`,
                       backgroundColor: project.color,
                       opacity: hoveredProject === project.id ? 0.8 : 0.4
                     }">
                  <span class="text-sm font-medium text-black truncate">{{ project.name }}</span>
                </div>
              </div>
              <span class="text-sm text-gray-400 w-32 text-right">{{ project.end }}</span>
            </div>
            <Transition name="slide">
              <div v-if="hoveredProject === project.id"
                   class="ml-36 bg-terminal-panel rounded-lg p-4 border border-terminal-cyan/30">
                <p class="text-sm text-gray-400 mb-2">
                  Duration: {{ project.duration }} months | Complexity: {{ project.complexity }}/10
                </p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tech in project.technologies" :key="tech"
                        class="text-xs px-2 py-1 rounded border"
                        :style="{ borderColor: `${project.color}40`, color: project.color }">
                    {{ tech }}
                  </span>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const hoveredProject = ref(null)

const projects = [
  { id: 1, name: 'IT Administrator / Engineer - Al-Gamdhi, KSA', start: '2003-06', end: '2014-01', duration: 127, complexity: 9, technologies: ['Windows Server', 'Active Directory', 'Fiber Optic', 'Cisco'], color: '#00FF41' },
  { id: 2, name: 'Project Manager / Web Dev - iBrains Technologies', start: '2009-06', end: '2009-12', duration: 7, complexity: 7, technologies: ['HTML/CSS/JS', 'Joomla', 'MySQL', 'CCTV'], color: '#9D4EDD' },
  { id: 3, name: 'SCM Buyer - Equipment Engineers Inc.', start: '2015-01', end: '2016-01', duration: 12, complexity: 6, technologies: ['SAP', 'NetSuite', 'Supply Chain'], color: '#00D9FF' },
  { id: 4, name: 'CS Advisor / Trainer - Concentrix / Alorica', start: '2016-02', end: '2021-07', duration: 65, complexity: 5, technologies: ['Technical Support', 'Training', 'Telecom'], color: '#9D4EDD' },
  { id: 5, name: 'IT Specialist & Manager - Freelance / ASR / Modern Trend', start: '2003-01', end: '2024-12', duration: 252, complexity: 8, technologies: ['Visual Basic', 'SQL', 'VoIP', 'VPN'], color: '#00FF41' },
  { id: 6, name: 'TEFL & CS Educator - Ikh Zasag University, Mongolia', start: '2021-10', end: '2025-06', duration: 44, complexity: 8, technologies: ['Python', 'Java', 'AutoCAD', 'AI Tools'], color: '#00D9FF' }
]

const contributionData = (() => {
  const weeks = []
  for (let w = 0; w < 52; w++) {
    const days = []
    for (let d = 0; d < 7; d++) {
      days.push(Math.floor(Math.random() * 5))
    }
    weeks.push(days)
  }
  return weeks
})()

const getIntensityColor = (intensity) => {
  const colors = [
    'rgba(0, 255, 65, 0.1)', 'rgba(0, 255, 65, 0.3)',
    'rgba(0, 255, 65, 0.5)', 'rgba(0, 255, 65, 0.7)', 'rgba(0, 255, 65, 0.9)'
  ]
  return colors[intensity]
}
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
