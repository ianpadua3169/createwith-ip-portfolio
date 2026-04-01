<template>
  <div class="mt-4" aria-label="Touch controls">
    <p class="text-center text-xs text-gray-500 mb-2 sm:hidden">
      Tap to steer
    </p>
    <div
      class="grid grid-cols-3 gap-2 mx-auto w-fit sm:max-w-[220px]"
      :class="dense ? 'max-w-[200px]' : ''"
    >
      <span class="min-h-12 min-w-12 sm:min-h-10 sm:min-w-10" />
      <button
        type="button"
        class="min-h-12 min-w-12 sm:min-h-10 sm:min-w-10 rounded-xl border-2 border-terminal-green/40 bg-terminal-panel text-terminal-green flex items-center justify-center touch-manipulation select-none active:bg-terminal-green/20 active:scale-95 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-cyan/50"
        aria-label="Up"
        @pointerdown.prevent="emitDir(0, -1)"
      >
        <ChevronUp class="w-7 h-7 sm:w-6 sm:h-6 mx-auto" />
      </button>
      <span class="min-h-12 min-w-12 sm:min-h-10 sm:min-w-10" />
      <button
        type="button"
        class="min-h-12 min-w-12 sm:min-h-10 sm:min-w-10 rounded-xl border-2 border-terminal-green/40 bg-terminal-panel text-terminal-green flex items-center justify-center touch-manipulation select-none active:bg-terminal-green/20 active:scale-95 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-cyan/50"
        aria-label="Left"
        @pointerdown.prevent="emitDir(-1, 0)"
      >
        <ChevronLeft class="w-7 h-7 sm:w-6 sm:h-6 mx-auto" />
      </button>
      <div class="min-h-12 min-w-12 sm:min-h-10 sm:min-w-10 rounded-lg border border-terminal-green/20 flex items-center justify-center">
        <span class="text-terminal-green/40 text-xs terminal-text">◇</span>
      </div>
      <button
        type="button"
        class="min-h-12 min-w-12 sm:min-h-10 sm:min-w-10 rounded-xl border-2 border-terminal-green/40 bg-terminal-panel text-terminal-green flex items-center justify-center touch-manipulation select-none active:bg-terminal-green/20 active:scale-95 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-cyan/50"
        aria-label="Right"
        @pointerdown.prevent="emitDir(1, 0)"
      >
        <ChevronRight class="w-7 h-7 sm:w-6 sm:h-6 mx-auto" />
      </button>
      <span class="min-h-12 min-w-12 sm:min-h-10 sm:min-w-10" />
      <button
        type="button"
        class="min-h-12 min-w-12 sm:min-h-10 sm:min-w-10 rounded-xl border-2 border-terminal-green/40 bg-terminal-panel text-terminal-green flex items-center justify-center touch-manipulation select-none active:bg-terminal-green/20 active:scale-95 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-cyan/50"
        aria-label="Down"
        @pointerdown.prevent="emitDir(0, 1)"
      >
        <ChevronDown class="w-7 h-7 sm:w-6 sm:h-6 mx-auto" />
      </button>
      <span class="min-h-12 min-w-12 sm:min-h-10 sm:min-w-10" />
    </div>
  </div>
</template>

<script setup>
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-vue-next'

defineProps({
  /** Slightly tighter grid on small modals */
  dense: { type: Boolean, default: false }
})

const emit = defineEmits(['dir'])

function emitDir(x, y) {
  emit('dir', { x, y })
}
</script>

