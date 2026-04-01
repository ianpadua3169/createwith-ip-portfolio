<template>
  <Teleport to="body">
    <Transition name="snake-fade">
      <div v-if="open"
           class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto overscroll-contain py-4"
           @click.self="close">
        <div class="bg-terminal-panel rounded-xl p-4 sm:p-6 neon-border max-w-[95vw] w-full touch-manipulation my-auto" @click.stop>
          <div class="flex items-center justify-between mb-4 gap-4">
            <h3 class="text-xl font-bold text-terminal-green terminal-text">Snake Game</h3>
            <div class="text-terminal-cyan terminal-text">Score: {{ score }}</div>
          </div>

          <canvas ref="canvasRef"
                  :width="gridSize * cellSize"
                  :height="gridSize * cellSize"
                  class="border border-terminal-green/30 rounded-lg mb-2 block mx-auto bg-black w-full max-w-[min(92vw,400px)] h-auto [image-rendering:pixelated]" />

          <p v-if="!gameStarted && !gameOver" class="text-center text-gray-400 text-sm mb-1">
            <span class="hidden sm:inline">Arrow keys</span><span class="sm:hidden">Tap the pad</span> to move &bull;
            <span class="hidden sm:inline"> any key starts</span><span class="sm:hidden"> first tap starts</span>
          </p>

          <GameTouchDpad v-if="!gameOver" class="pb-2" @dir="onTouchDir" />

          <div v-if="gameOver" class="text-center mb-4">
            <p class="text-terminal-purple font-bold mb-2">Game Over!</p>
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
const props = defineProps({ open: Boolean })
const emit = defineEmits(['update:open'])

const canvasRef = ref(null)
const score = ref(0)
const gameOver = ref(false)
const snake = ref([{ x: 10, y: 10 }])
const food = ref({ x: 15, y: 15 })
const direction = ref({ x: 1, y: 0 })
const gameStarted = ref(false)

const gridSize = 20
const cellSize = 20

function close() {
  emit('update:open', false)
}

function restart() {
  const start = [{ x: 10, y: 10 }]
  snake.value = start
  food.value = randomFood(start)
  direction.value = { x: 1, y: 0 }
  score.value = 0
  gameOver.value = false
  gameStarted.value = false
}

function randomFood(body) {
  let p
  let guard = 0
  do {
    p = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    }
    guard++
  } while (body.some((s) => s.x === p.x && s.y === p.y) && guard < 500)
  return p
}

function applyDirection(dx, dy) {
  if (!props.open || gameOver.value) return
  if (!gameStarted.value) gameStarted.value = true
  if (dx === 0 && dy === -1 && direction.value.y === 0) direction.value = { x: 0, y: -1 }
  else if (dx === 0 && dy === 1 && direction.value.y === 0) direction.value = { x: 0, y: 1 }
  else if (dx === -1 && dy === 0 && direction.value.x === 0) direction.value = { x: -1, y: 0 }
  else if (dx === 1 && dy === 0 && direction.value.x === 0) direction.value = { x: 1, y: 0 }
}

function onTouchDir({ x, y }) {
  applyDirection(x, y)
}

function onKeydown(e) {
  if (!props.open) return

  if (e.key === 'Escape') {
    e.preventDefault()
    close()
    return
  }

  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault()
      applyDirection(0, -1)
      break
    case 'ArrowDown':
      e.preventDefault()
      applyDirection(0, 1)
      break
    case 'ArrowLeft':
      e.preventDefault()
      applyDirection(-1, 0)
      break
    case 'ArrowRight':
      e.preventDefault()
      applyDirection(1, 0)
      break
    default:
      break
  }
}

let tick = null

watch(
  () => props.open,
  (val) => {
    if (!import.meta.client) return

    if (val) {
      if (tick) {
        clearInterval(tick)
        tick = null
      }
      restart()
      window.addEventListener('keydown', onKeydown)
      tick = setInterval(() => {
        if (!gameStarted.value || gameOver.value) return

        const dir = direction.value
        const prev = snake.value
        const head = prev[0]
        const newHead = { x: head.x + dir.x, y: head.y + dir.y }

        if (newHead.x < 0 || newHead.x >= gridSize || newHead.y < 0 || newHead.y >= gridSize) {
          gameOver.value = true
          return
        }

        if (prev.some((s) => s.x === newHead.x && s.y === newHead.y)) {
          gameOver.value = true
          return
        }

        const next = [newHead, ...prev]
        const f = food.value
        if (newHead.x === f.x && newHead.y === f.y) {
          score.value += 10
          food.value = randomFood(next)
        } else {
          next.pop()
        }
        snake.value = next
      }, 150)
    } else {
      window.removeEventListener('keydown', onKeydown)
      if (tick) {
        clearInterval(tick)
        tick = null
      }
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  if (!import.meta.client) return
  window.removeEventListener('keydown', onKeydown)
  if (tick) clearInterval(tick)
})

watch([snake, food, () => props.open], async () => {
  if (!props.open) return
  await nextTick()
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = '#00FF41'
  ctx.globalAlpha = 0.1
  for (let i = 0; i <= gridSize; i++) {
    ctx.beginPath()
    ctx.moveTo(i * cellSize, 0)
    ctx.lineTo(i * cellSize, gridSize * cellSize)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i * cellSize)
    ctx.lineTo(gridSize * cellSize, i * cellSize)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  snake.value.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#00FF41' : '#00D9FF'
    ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize - 2, cellSize - 2)
  })

  const fd = food.value
  ctx.fillStyle = '#9D4EDD'
  ctx.fillRect(fd.x * cellSize, fd.y * cellSize, cellSize - 2, cellSize - 2)
}, { deep: true })
</script>

<style scoped>
.snake-fade-enter-active,
.snake-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.snake-fade-enter-from,
.snake-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
