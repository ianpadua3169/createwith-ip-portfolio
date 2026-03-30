<template>
  <section class="py-24 px-4 sm:px-6 lg:px-8 bg-terminal-dark">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="text-4xl md:text-5xl font-bold mb-4 neon-glow-blue">Technology stack</h2>
        <p class="text-lg text-gray-400 max-w-2xl mx-auto">Click any node to explore connections and related projects</p>
      </div>

      <div class="relative w-full h-[500px] bg-black/30 rounded-2xl neon-border overflow-hidden">
        <svg class="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
          <line v-for="(conn, i) in connections" :key="'c'+i"
                :x1="getNode(conn.from).x" :y1="getNode(conn.from).y"
                :x2="getNode(conn.to).x" :y2="getNode(conn.to).y"
                :stroke="isHighlightedConnection(conn) ? getNode(conn.from).color : '#00FF41'"
                :stroke-width="isHighlightedConnection(conn) ? 2 : 1"
                :stroke-opacity="isHighlightedConnection(conn) ? 0.6 : 0.2" />

          <g v-for="node in nodes" :key="node.id" class="cursor-pointer" @click="selectedNode = node">
            <circle :cx="node.x" :cy="node.y"
                    :r="selectedNode?.id === node.id ? 35 : hoveredNode?.id === node.id ? 32 : 28"
                    :fill="node.color"
                    :fill-opacity="selectedNode?.id === node.id || isConnected(node.id) ? 0.3 : 0.1"
                    :stroke="node.color" :stroke-width="selectedNode?.id === node.id ? 3 : 2"
                    :style="{ filter: selectedNode?.id === node.id || hoveredNode?.id === node.id ? `drop-shadow(0 0 10px ${node.color})` : 'none' }"
                    class="transition-all duration-200"
                    @mouseenter="hoveredNode = node" @mouseleave="hoveredNode = null" />
            <text :x="node.x" :y="node.y" text-anchor="middle" dominant-baseline="middle"
                  :fill="node.color" font-size="14" font-weight="600"
                  class="pointer-events-none terminal-text" :style="{ textShadow: `0 0 5px ${node.color}` }">
              {{ node.label }}
            </text>
          </g>
        </svg>
      </div>

      <!-- Dialog -->
      <Teleport to="body">
        <div v-if="selectedNode" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
             @click="selectedNode = null">
          <div class="bg-terminal-panel rounded-xl p-8 max-w-md w-full mx-4 border border-terminal-cyan/30"
               @click.stop>
            <h3 class="text-2xl font-bold text-terminal-cyan mb-2">{{ selectedNode.label }}</h3>
            <p class="text-gray-400 mb-4">Projects using this technology</p>
            <div class="space-y-3">
              <div v-for="(project, i) in selectedNode.projects" :key="i"
                   class="p-4 bg-black/30 rounded-lg border border-terminal-green/20 hover:border-terminal-green/40 transition-colors">
                <p class="text-terminal-green font-medium">{{ project }}</p>
              </div>
            </div>
            <button class="mt-6 w-full px-4 py-2 bg-terminal-green text-black rounded-lg hover:bg-terminal-green/80 transition-colors font-medium"
                    @click="selectedNode = null">Close</button>
          </div>
        </div>
      </Teleport>
    </div>
  </section>
</template>

<script setup>
const selectedNode = ref(null)
const hoveredNode = ref(null)

const nodes = [
  { id: 'java', label: 'Java', x: 120, y: 90, color: '#00FF41', projects: ['Library Management System (LMS)', 'IT Curriculum - Ikh Zasag University'] },
  { id: 'python', label: 'Python', x: 320, y: 70, color: '#00D9FF', projects: ['IT Curriculum - Ikh Zasag University', 'AI-Assisted Development'] },
  { id: 'javascript', label: 'JavaScript', x: 520, y: 90, color: '#00FF41', projects: ['Headless CMS Blog & Portfolio', 'BIR Zonal Value Plugin', 'Security & Web Deployment'] },
  { id: 'php', label: 'PHP', x: 680, y: 150, color: '#9D4EDD', projects: ['BIR Zonal Value Plugin (WordPress)', 'Web Portal Development'] },
  { id: 'sql', label: 'SQL', x: 220, y: 200, color: '#9D4EDD', projects: ['Library Management System', 'Legacy Financial Migration', 'BIR Zonal Value Plugin'] },
  { id: 'nuxt', label: 'Nuxt.js', x: 420, y: 180, color: '#00D9FF', projects: ['Headless CMS Blog & Portfolio (Nuxt + Sanity.io)'] },
  { id: 'cisco', label: 'Cisco', x: 100, y: 320, color: '#00FF41', projects: ['Multi-Branch Fiber Optic Migration', 'Enterprise Network Infrastructure'] },
  { id: 'winserver', label: 'Win Server', x: 300, y: 300, color: '#00D9FF', projects: ['Enterprise Server Management (99.9% uptime)', 'Active Directory Administration'] },
  { id: 'linux', label: 'Linux', x: 500, y: 310, color: '#9D4EDD', projects: ['Server Administration', 'VMware & Hyper-V Virtualization'] },
  { id: 'network', label: 'Networking', x: 200, y: 410, color: '#00FF41', projects: ['Fiber Optic Splicing & Testing', 'VPN / Firewall (ASA, Check Point)'] },
  { id: 'vb', label: 'VB / Legacy', x: 420, y: 400, color: '#00D9FF', projects: ['Legacy Financial System Migration (DBase, Clipper)', 'Custom Business Solutions'] },
  { id: 'security', label: 'Security', x: 620, y: 330, color: '#9D4EDD', projects: ['CCTV Systems Architecture', 'Integrated Security & Web Deployment'] }
]

const connections = [
  { from: 'java', to: 'sql' }, { from: 'java', to: 'python' }, { from: 'python', to: 'nuxt' },
  { from: 'javascript', to: 'nuxt' }, { from: 'javascript', to: 'php' }, { from: 'php', to: 'sql' },
  { from: 'sql', to: 'winserver' }, { from: 'nuxt', to: 'linux' }, { from: 'cisco', to: 'winserver' },
  { from: 'cisco', to: 'network' }, { from: 'winserver', to: 'linux' }, { from: 'linux', to: 'security' },
  { from: 'network', to: 'security' }, { from: 'network', to: 'vb' }, { from: 'vb', to: 'sql' },
  { from: 'security', to: 'php' }
]

const getNode = (id) => nodes.find(n => n.id === id)

const isConnected = (nodeId) => {
  if (!selectedNode.value) return false
  return connections.some(c =>
    (c.from === selectedNode.value.id && c.to === nodeId) ||
    (c.to === selectedNode.value.id && c.from === nodeId)
  )
}

const isHighlightedConnection = (conn) => {
  return selectedNode.value && (selectedNode.value.id === conn.from || selectedNode.value.id === conn.to)
}
</script>
