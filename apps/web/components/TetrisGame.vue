<template>
  <Teleport to="body">
    <Transition name="tetris-fade">
      <div v-if="open"
           class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto overscroll-contain py-4 px-3 sm:px-4 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
           @click.self="close">
        <div class="bg-terminal-panel rounded-xl p-4 sm:p-6 neon-border max-w-[95vw] w-full touch-manipulation my-auto min-h-0" @click.stop>
          <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h3 class="text-xl font-bold text-terminal-green terminal-text">Tetris</h3>
            <div class="flex gap-4 text-sm terminal-text">
              <span class="text-terminal-cyan">Score: {{ score }}</span>
              <span class="text-terminal-purple">Lines: {{ linesCleared }}</span>
            </div>
          </div>

          <canvas ref="canvasRef"
                  :width="COLS * cell"
                  :height="VISIBLE_ROWS * cell"
                  class="border border-terminal-green/30 rounded-lg mb-2 block mx-auto bg-black w-full max-w-[min(92vw,280px)] h-auto [image-rendering:pixelated]" />

          <p v-if="!gameOver" class="text-center text-gray-400 text-sm mb-2 px-1">
            <span class="hidden sm:inline">Arrows move / rotate &bull; </span>
            <span class="sm:hidden">Pad + buttons below &bull; </span>
            <span class="hidden sm:inline"><kbd class="px-1 rounded border border-terminal-green/40 text-terminal-green text-xs">Space</kbd> hard drop</span>
            <span class="sm:hidden">Hard drop button drops instantly</span>
          </p>

          <div v-if="!gameOver" class="flex flex-col items-stretch gap-3 pb-2 max-w-xs mx-auto w-full">
            <div class="grid grid-cols-2 gap-2">
              <button type="button"
                      class="min-h-[48px] xl:min-h-10 rounded-xl border-2 border-terminal-cyan/50 bg-terminal-panel text-terminal-cyan flex items-center justify-center gap-2 touch-manipulation select-none active:bg-terminal-cyan/15 active:scale-[0.98] transition-transform font-medium terminal-text text-sm"
                      aria-label="Rotate piece"
                      @pointerdown.prevent="onRotate">
                <RotateCw class="w-6 h-6 xl:w-5 xl:h-5 shrink-0" />
                <span class="truncate">Rotate</span>
              </button>
              <button type="button"
                      class="min-h-[48px] xl:min-h-10 rounded-xl border-2 border-terminal-purple/50 bg-terminal-panel text-terminal-purple flex items-center justify-center gap-2 touch-manipulation select-none active:bg-terminal-purple/15 active:scale-[0.98] transition-transform font-medium terminal-text text-sm"
                      aria-label="Hard drop"
                      @pointerdown.prevent="onHardDropTouch">
                <ArrowDownToLine class="w-6 h-6 xl:w-5 xl:h-5 shrink-0" />
                <span class="truncate">Drop</span>
              </button>
            </div>
            <GameTouchDpad dense omit-up class="!mt-0" @dir="onTouchDir" />
          </div>

          <div v-if="gameOver" class="text-center mb-4">
            <p class="text-terminal-purple font-bold mb-2">Game Over</p>
            <button type="button"
                    class="px-4 py-2 bg-terminal-green text-black rounded-lg hover:bg-terminal-green/80 transition-colors duration-200 active:scale-95"
                    @click="restart">
              Play again
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
import { RotateCw, ArrowDownToLine } from 'lucide-vue-next'

/** 10×22 board (2 hidden rows at top). Canvas shows bottom 20 rows. */

const props = defineProps({ open: Boolean })
const emit = defineEmits(['update:open'])

const COLS = 10
const HIDDEN = 2
const VISIBLE_ROWS = 20
const ROWS = HIDDEN + VISIBLE_ROWS
const cell = 24

const canvasRef = ref(null)

/** Per-type rotations: list of [dx,dy] from piece origin (top-left of bounding box). */
const ROTATIONS = {
  I: [
    [[0, 1], [1, 1], [2, 1], [3, 1]],
    [[2, 0], [2, 1], [2, 2], [2, 3]],
    [[0, 2], [1, 2], [2, 2], [3, 2]],
    [[1, 0], [1, 1], [1, 2], [1, 3]]
  ],
  O: [
    [[1, 0], [2, 0], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [1, 1], [2, 1]]
  ],
  T: [
    [[1, 0], [0, 1], [1, 1], [2, 1]],
    [[1, 0], [1, 1], [2, 1], [1, 2]],
    [[0, 1], [1, 1], [2, 1], [1, 2]],
    [[1, 0], [0, 1], [1, 1], [1, 2]]
  ],
  S: [
    [[1, 0], [2, 0], [0, 1], [1, 1]],
    [[1, 0], [0, 1], [1, 1], [0, 2]],
    [[1, 0], [2, 0], [0, 1], [1, 1]],
    [[1, 0], [0, 1], [1, 1], [0, 2]]
  ],
  Z: [
    [[0, 0], [1, 0], [1, 1], [2, 1]],
    [[2, 0], [1, 1], [2, 1], [1, 2]],
    [[0, 0], [1, 0], [1, 1], [2, 1]],
    [[2, 0], [1, 1], [2, 1], [1, 2]]
  ],
  J: [
    [[0, 0], [0, 1], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [1, 1], [1, 2]],
    [[0, 1], [1, 1], [2, 1], [2, 2]],
    [[1, 0], [1, 1], [0, 2], [1, 2]]
  ],
  L: [
    [[2, 0], [0, 1], [1, 1], [2, 1]],
    [[1, 0], [1, 1], [1, 2], [2, 2]],
    [[0, 1], [1, 1], [2, 1], [0, 2]],
    [[0, 0], [1, 0], [1, 1], [1, 2]]
  ]
}

const COLORS = {
  I: '#00D9FF',
  O: '#FFE135',
  T: '#9D4EDD',
  S: '#00FF41',
  Z: '#FF5555',
  J: '#5588FF',
  L: '#FFAA33'
}

const TYPES = Object.keys(ROTATIONS)

const board = ref(
  Array.from({ length: ROWS }, () => Array(COLS).fill(0))
)

const piece = ref({
  type: 'T',
  rot: 0,
  x: 3,
  y: 0
})

const score = ref(0)
const linesCleared = ref(0)
const gameOver = ref(false)

let tickId = null
const DROP_MS = 650

function close() {
  emit('update:open', false)
}

function randomType() {
  return TYPES[Math.floor(Math.random() * TYPES.length)]
}

function cellsFor(type, rot, x, y) {
  return ROTATIONS[type][rot].map(([dx, dy]) => ({ x: x + dx, y: y + dy }))
}

function validCells(cells) {
  for (const { x, y } of cells) {
    if (x < 0 || x >= COLS || y >= ROWS) return false
    if (y >= 0 && board.value[y][x]) return false
  }
  return true
}

function spawn() {
  const type = randomType()
  piece.value = { type, rot: 0, x: 3, y: 0 }
  if (!validCells(cellsFor(type, 0, 3, 0))) {
    gameOver.value = true
  }
}

function restart() {
  board.value = Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  score.value = 0
  linesCleared.value = 0
  gameOver.value = false
  spawn()
}

function mergePiece() {
  const { type, rot, x, y } = piece.value
  const colorKey = type
  for (const c of cellsFor(type, rot, x, y)) {
    if (c.y >= 0 && c.y < ROWS && c.x >= 0 && c.x < COLS) {
      board.value[c.y][c.x] = colorKey
    }
  }
}

function clearLines() {
  let cleared = 0
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board.value[r].every((cell) => cell !== 0)) {
      board.value.splice(r, 1)
      board.value.unshift(Array(COLS).fill(0))
      cleared++
      r++
    }
  }
  if (cleared > 0) {
    const pts = [0, 100, 300, 500, 800][cleared] ?? 800
    score.value += pts
    linesCleared.value += cleared
  }
}

function tryMove(dx, dy) {
  if (gameOver.value) return false
  const { type, rot, x, y } = piece.value
  const next = cellsFor(type, rot, x + dx, y + dy)
  if (!validCells(next)) return false
  piece.value = { type, rot, x: x + dx, y: y + dy }
  return true
}

function tryRotate() {
  if (gameOver.value) return
  const { type, rot, x, y } = piece.value
  const nextRot = (rot + 1) % 4
  const kicks = [[0, 0], [-1, 0], [1, 0], [-2, 0], [2, 0], [0, -1], [1, -1], [-1, -1]]
  for (const [kx, ky] of kicks) {
    const cells = cellsFor(type, nextRot, x + kx, y + ky)
    if (validCells(cells)) {
      piece.value = { type, rot: nextRot, x: x + kx, y: y + ky }
      return
    }
  }
}

function hardDrop() {
  if (gameOver.value) return
  while (tryMove(0, 1)) {
    score.value += 1
  }
  lockPiece()
}

function lockPiece() {
  mergePiece()
  clearLines()
  spawn()
}

function tickDrop() {
  if (gameOver.value) return
  if (!tryMove(0, 1)) {
    lockPiece()
  }
}

function onTouchDir({ x, y }) {
  if (!props.open || gameOver.value) return
  if (x === -1 && y === 0) tryMove(-1, 0)
  else if (x === 1 && y === 0) tryMove(1, 0)
  else if (x === 0 && y === 1) tryMove(0, 1)
}

function onRotate() {
  tryRotate()
}

function onHardDropTouch() {
  hardDrop()
}

function onKeydown(e) {
  if (!props.open) return
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
    return
  }
  if (gameOver.value) return

  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault()
      tryMove(-1, 0)
      break
    case 'ArrowRight':
      e.preventDefault()
      tryMove(1, 0)
      break
    case 'ArrowDown':
      e.preventDefault()
      tryMove(0, 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      tryRotate()
      break
    case ' ':
      e.preventDefault()
      hardDrop()
      break
    default:
      break
  }
}

watch(
  () => props.open,
  (val) => {
    if (!import.meta.client) return
    if (val) {
      restart()
      window.addEventListener('keydown', onKeydown)
      if (tickId) clearInterval(tickId)
      tickId = setInterval(tickDrop, DROP_MS)
    } else {
      window.removeEventListener('keydown', onKeydown)
      if (tickId) {
        clearInterval(tickId)
        tickId = null
      }
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  if (!import.meta.client) return
  window.removeEventListener('keydown', onKeydown)
  if (tickId) clearInterval(tickId)
})

function draw() {
  if (!props.open) return
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const ghost = piece.value
  const liveCells = gameOver.value ? [] : cellsFor(ghost.type, ghost.rot, ghost.x, ghost.y)

  for (let vr = 0; vr < VISIBLE_ROWS; vr++) {
    const br = vr + HIDDEN
    for (let c = 0; c < COLS; c++) {
      const x = c * cell
      const y = vr * cell
      const locked = board.value[br][c]
      ctx.fillStyle = '#0a0a12'
      ctx.fillRect(x, y, cell, cell)
      ctx.strokeStyle = '#003322'
      ctx.strokeRect(x + 0.5, y + 0.5, cell - 1, cell - 1)
      if (locked) {
        ctx.fillStyle = COLORS[locked] || '#00FF41'
        ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2)
      }
    }
  }

  for (const { x: cx, y: cy } of liveCells) {
    if (cy < HIDDEN) continue
    const vr = cy - HIDDEN
    if (vr < 0 || vr >= VISIBLE_ROWS) continue
    const x = cx * cell
    const y = vr * cell
    ctx.fillStyle = COLORS[ghost.type] || '#00FF41'
    ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2)
    ctx.strokeStyle = '#fff'
    ctx.globalAlpha = 0.35
    ctx.strokeRect(x + 2, y + 2, cell - 5, cell - 5)
    ctx.globalAlpha = 1
  }
}

watch(
  [board, piece, () => props.open, () => gameOver.value],
  async () => {
    await nextTick()
    draw()
  },
  { deep: true }
)
</script>

<style scoped>
.tetris-fade-enter-active,
.tetris-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.tetris-fade-enter-from,
.tetris-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
