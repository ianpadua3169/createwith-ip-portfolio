<template>
  <Teleport to="body">
    <Transition name="pac-fade">
      <div v-if="open"
           class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto overscroll-contain py-4"
           @click.self="close">
        <div class="bg-terminal-panel rounded-xl p-4 sm:p-6 neon-border max-w-[98vw] w-full overflow-auto touch-manipulation my-auto" @click.stop>
          <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h3 class="text-xl font-bold text-terminal-green terminal-text">Pac-Man</h3>
            <div class="flex gap-4 text-sm terminal-text">
              <span class="text-terminal-cyan">Score: {{ score }}</span>
              <span class="text-terminal-purple">Lives: {{ lives }}</span>
            </div>
          </div>

          <canvas ref="canvasRef"
                  :width="cols * cell"
                  :height="rows * cell"
                  class="border border-terminal-green/30 rounded-lg block mx-auto bg-black mb-2 w-full max-w-[min(96vw,336px)] h-auto [image-rendering:pixelated]" />

          <p v-if="!gameStarted && !gameOver && !won" class="text-center text-gray-400 text-sm mb-2">
            <span class="hidden sm:inline">Arrow keys</span><span class="sm:hidden">Tap the pad</span> to move &bull; Clear pellets &bull; Avoid ghosts
          </p>

          <GameTouchDpad v-if="!gameOver && !won" dense class="pb-1" @dir="onTouchDir" />
          <p v-if="won" class="text-center text-terminal-green font-bold text-sm mb-3">You cleared the maze!</p>

          <div v-if="gameOver" class="text-center mb-3">
            <p class="text-terminal-purple font-bold mb-2">Game Over</p>
            <button type="button"
                    class="px-4 py-2 bg-terminal-green text-black rounded-lg hover:bg-terminal-green/80 transition-colors duration-200 active:scale-95"
                    @click="restart">
              Restart
            </button>
          </div>

          <button type="button"
                  class="w-full px-4 py-2 bg-terminal-panel border border-terminal-cyan/30 text-terminal-cyan rounded-lg hover:bg-terminal-cyan/10 transition-colors duration-200 active:scale-95"
                  @click="close">
            Close
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
/** Classic-style grid Pac-Man: maze, pellets, 3 ghosts, 3 lives. SSR-safe open/close lifecycle. */

const props = defineProps({ open: Boolean })
const emit = defineEmits(['update:open'])

const canvasRef = ref(null)
const cell = 16
const rows = 17
const cols = 21

// # wall, . pellet, (space) empty corridor
const MAZE_RAW = [
  '#####################',
  '#.........#.........#',
  '#.###.###.#.###.###.#',
  '#...................#',
  '#.###.#.#####.#.###.#',
  '#.....#...#...#.....#',
  '#####.###.#.###.#####',
  '    #.#.......#.#    ',
  '#####.#.##-##.#.#####',
  '      ..#...#..      ',
  '#####.#.#####.#.#####',
  '    #.#.......#.#    ',
  '#####.#.#####.#.#####',
  '#.........#.........#',
  '#.###.###.#.###.###.#',
  '#...................#',
  '#####################'
]

/** 1 wall, 2 pellet, 0 empty */
function parseMaze() {
  const g = []
  for (let r = 0; r < rows; r++) {
    const row = []
    const line = MAZE_RAW[r]
    for (let c = 0; c < cols; c++) {
      const ch = line[c]
      if (ch === '#' || ch === '-') row.push(1)
      else if (ch === '.') row.push(2)
      else row.push(0)
    }
    g.push(row)
  }
  return g
}

const grid = ref(parseMaze())
const score = ref(0)
const lives = ref(3)
const gameOver = ref(false)
const won = ref(false)
const gameStarted = ref(false)
const mouthPhase = ref(0)

/** Player: tile coords + fractional 0-1 for smooth step (optional simple: snap each tick) */
const pac = ref({ x: 10, y: 15, dx: 0, dy: 0, wantDx: 0, wantDy: -1 })

const ghosts = ref([
  { x: 8, y: 7, dx: 1, dy: 0, color: '#FF0000' },
  { x: 12, y: 7, dx: -1, dy: 0, color: '#FFB8FF' },
  { x: 10, y: 7, dx: 0, dy: 1, color: '#00FFFF' }
])

function close() {
  emit('update:open', false)
}

function pelletsLeft() {
  let n = 0
  for (const row of grid.value) {
    for (const t of row) {
      if (t === 2) n++
    }
  }
  return n
}

function restart() {
  grid.value = parseMaze()
  score.value = 0
  lives.value = 3
  gameOver.value = false
  won.value = false
  gameStarted.value = false
  mouthPhase.value = 0
  pac.value = { x: 10, y: 15, dx: 0, dy: 0, wantDx: 0, wantDy: -1 }
  ghosts.value = [
    { x: 8, y: 7, dx: 1, dy: 0, color: '#FF0000' },
    { x: 12, y: 7, dx: -1, dy: 0, color: '#FFB8FF' },
    { x: 10, y: 7, dx: 0, dy: 1, color: '#00FFFF' }
  ]
}

/** Tunnel row: horizontal wrap for side exits */
const TUNNEL_ROW = 9

function normX(x, y) {
  if (y === TUNNEL_ROW) {
    if (x < 0) return cols - 1
    if (x >= cols) return 0
  }
  return x
}

function isWall(x, y) {
  if (y < 0 || y >= rows) return true
  const xx = normX(x, y)
  if (y !== TUNNEL_ROW && (x < 0 || x >= cols)) return true
  return grid.value[y][xx] === 1
}

function tryMoveEntity(ent, useWant = false) {
  let rdx = ent.dx
  let rdy = ent.dy
  if (useWant && 'wantDx' in ent && (ent.wantDx !== 0 || ent.wantDy !== 0)) {
    const wx = ent.x + ent.wantDx
    const wy = ent.y + ent.wantDy
    if (!isWall(wx, wy)) {
      rdx = ent.wantDx
      rdy = ent.wantDy
      ent.dx = rdx
      ent.dy = rdy
    }
  }
  const ny = ent.y + rdy
  if (ny < 0 || ny >= rows) return false
  if (isWall(ent.x + rdx, ent.y + rdy)) return false
  ent.x = normX(ent.x + rdx, ny)
  ent.y = ny
  return true
}

function manhattan(ax, ay, bx, by) {
  return Math.abs(ax - bx) + Math.abs(ay - by)
}

function validGhostDirs(gx, gy, odx, ody) {
  const dirs = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0]
  ]
  const out = []
  for (const [dx, dy] of dirs) {
    if (dx === -odx && dy === -ody) continue
    const nx = gx + dx
    const ny = gy + dy
    if (!isWall(nx, ny)) out.push([dx, dy])
  }
  if (out.length === 0) return [[-odx, -ody]]
  return out
}

function moveGhosts() {
  const px = pac.value.x
  const py = pac.value.y
  for (const g of ghosts.value) {
    const opts = validGhostDirs(g.x, g.y, g.dx, g.dy)
    opts.sort((a, b) => {
      const ax = g.x + a[0]
      const ay = g.y + a[1]
      const bx = g.x + b[0]
      const by = g.y + b[1]
      return manhattan(ax, ay, px, py) - manhattan(bx, by, px, py)
    })
    const pick = opts[Math.floor(Math.random() * Math.min(2, opts.length))] || opts[0]
    g.dx = pick[0]
    g.dy = pick[1]
    const nx = normX(g.x + g.dx, g.y + g.dy)
    const ny = g.y + g.dy
    if (!isWall(g.x + g.dx, g.y + g.dy)) {
      g.x = nx
      g.y = ny
    }
  }
}

function tickGame() {
  if (!gameStarted.value || gameOver.value || won.value) return

  if (pelletsLeft() === 0) {
    won.value = true
    return
  }

  tryMoveEntity(pac.value, true)
  const cellType = grid.value[pac.value.y][pac.value.x]
  if (cellType === 2) {
    grid.value[pac.value.y][pac.value.x] = 0
    score.value += 10
  }

  moveGhosts()

  for (const g of ghosts.value) {
    if (g.x === pac.value.x && g.y === pac.value.y) {
      lives.value -= 1
      if (lives.value <= 0) {
        gameOver.value = true
      } else {
        pac.value = { x: 10, y: 15, dx: 0, dy: 0, wantDx: 0, wantDy: -1 }
        ghosts.value = [
          { x: 8, y: 7, dx: 1, dy: 0, color: '#FF0000' },
          { x: 12, y: 7, dx: -1, dy: 0, color: '#FFB8FF' },
          { x: 10, y: 7, dx: 0, dy: 1, color: '#00FFFF' }
        ]
      }
      break
    }
  }

  mouthPhase.value = (mouthPhase.value + 1) % 4
}

function applyWantDir(dx, dy) {
  if (!props.open || gameOver.value || won.value) return
  if (!gameStarted.value) gameStarted.value = true
  pac.value.wantDx = dx
  pac.value.wantDy = dy
}

function onTouchDir({ x, y }) {
  applyWantDir(x, y)
}

function onKeydown(e) {
  if (!props.open) return
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
    return
  }
  if (gameOver.value || won.value) return

  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault()
      applyWantDir(0, -1)
      break
    case 'ArrowDown':
      e.preventDefault()
      applyWantDir(0, 1)
      break
    case 'ArrowLeft':
      e.preventDefault()
      applyWantDir(-1, 0)
      break
    case 'ArrowRight':
      e.preventDefault()
      applyWantDir(1, 0)
      break
    default:
      break
  }
}

let intervalId = null

watch(
  () => props.open,
  (val) => {
    if (!import.meta.client) return

    if (val) {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
      restart()
      window.addEventListener('keydown', onKeydown)
      intervalId = setInterval(tickGame, 165)
    } else {
      window.removeEventListener('keydown', onKeydown)
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  if (!import.meta.client) return
  window.removeEventListener('keydown', onKeydown)
  if (intervalId) clearInterval(intervalId)
})

function draw() {
  if (!props.open) return
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const g = grid.value
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cell
      const y = r * cell
      const t = g[r][c]
      if (t === 1) {
        ctx.fillStyle = '#003366'
        ctx.strokeStyle = '#00FF41'
        ctx.lineWidth = 1
        ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2)
        ctx.strokeRect(x + 0.5, y + 0.5, cell - 1, cell - 1)
      } else if (t === 2) {
        ctx.fillStyle = '#FFE135'
        ctx.beginPath()
        ctx.arc(x + cell / 2, y + cell / 2, 2.2, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  const px = pac.value.x * cell + cell / 2
  const py = pac.value.y * cell + cell / 2
  const mouth = mouthPhase.value < 1 ? 0.15 : 0.45
  const pdx = pac.value.dx || pac.value.wantDx || 1
  const pdy = pac.value.dy || pac.value.wantDy || 0
  const baseAngle = Math.atan2(pdy || -0.001, pdx || 0.001)
  ctx.fillStyle = '#FFE135'
  ctx.beginPath()
  ctx.moveTo(px, py)
  ctx.arc(px, py, cell * 0.42, baseAngle + mouth * Math.PI, baseAngle + (2 - mouth) * Math.PI)
  ctx.fill()

  for (const g of ghosts.value) {
    const gx = g.x * cell
    const gy = g.y * cell
    const cx = gx + cell / 2
    const cy = gy + cell * 0.55
    ctx.fillStyle = g.color
    ctx.beginPath()
    ctx.arc(cx, cy - cell * 0.08, cell * 0.38, Math.PI, 0, false)
    ctx.lineTo(gx + cell * 0.92, gy + cell * 0.92)
    for (let i = 0; i < 3; i++) {
      const bx = gx + cell * 0.25 + i * (cell * 0.22)
      ctx.lineTo(bx, gy + cell)
    }
    ctx.lineTo(gx + cell * 0.08, gy + cell * 0.92)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(cx - cell * 0.12, cy - cell * 0.08, cell * 0.1, 0, Math.PI * 2)
    ctx.arc(cx + cell * 0.12, cy - cell * 0.08, cell * 0.1, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#003'
    ctx.beginPath()
    ctx.arc(cx - cell * 0.1 + g.dx * 2, cy - cell * 0.06, cell * 0.05, 0, Math.PI * 2)
    ctx.arc(cx + cell * 0.14 + g.dx * 2, cy - cell * 0.06, cell * 0.05, 0, Math.PI * 2)
    ctx.fill()
  }
}

watch(
  [grid, pac, ghosts, mouthPhase, () => props.open, () => gameOver.value, () => won.value],
  async () => {
    await nextTick()
    draw()
  },
  { deep: true }
)
</script>

<style scoped>
.pac-fade-enter-active,
.pac-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.pac-fade-enter-from,
.pac-fade-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
