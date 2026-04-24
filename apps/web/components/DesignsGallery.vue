<script setup lang="ts">
import { Palette, ExternalLink, X, Calendar, Tag, Wrench } from 'lucide-vue-next'
import { designs, type Design } from '~/data/designs'

interface Props {
  /** If provided, renders only this many (useful for the home teaser). */
  limit?: number
  /** Hide the section header (title + intro). */
  headless?: boolean
}
const props = defineProps<Props>()

const items = computed<Design[]>(() =>
  typeof props.limit === 'number' ? designs.slice(0, props.limit) : designs
)

const active = ref<Design | null>(null)
const activeIndex = ref<number>(-1)

function open(design: Design, index: number) {
  active.value = design
  activeIndex.value = index
}

function close() {
  active.value = null
  activeIndex.value = -1
}

function next(delta: number) {
  if (!items.value.length) return
  const len = items.value.length
  const nextIndex = (activeIndex.value + delta + len) % len
  activeIndex.value = nextIndex
  active.value = items.value[nextIndex]
}

function onKeydown(e: KeyboardEvent) {
  if (!active.value) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowRight') next(1)
  if (e.key === 'ArrowLeft') next(-1)
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

function formatDate(iso?: string) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
  } catch {
    return ''
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div>
      <div v-if="!headless" class="mb-12">
        <div class="flex items-center gap-2 terminal-text text-terminal-green/70 text-xs sm:text-sm mb-3">
          <Palette class="w-4 h-4" />
          <span>~/designs $ ls --gallery</span>
        </div>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold neon-glow">Web graphic designs</h2>
        <p class="mt-3 text-gray-400 max-w-2xl">
          Selected interface concepts, editorial covers, and design systems. Click any tile for the full view.
        </p>
      </div>

      <ul class="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="(design, i) in items" :key="design.slug">
          <button
            type="button"
            class="group w-full text-left rounded-2xl border border-terminal-green/20 bg-terminal-dark/60 hover:border-terminal-green/60 hover:bg-terminal-dark/90 transition-all overflow-hidden focus-visible:outline-none"
            @click="open(design, i)"
          >
            <div
              class="relative aspect-[16/10] overflow-hidden"
              :class="!design.image ? design.placeholder || 'bg-terminal-green/20' : ''"
            >
              <img
                v-if="design.image"
                :src="design.image"
                :alt="design.title"
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-3">
                <span class="text-[0.65rem] terminal-text text-terminal-green/80 uppercase tracking-wide">
                  {{ formatDate(design.completedAt) || 'Design' }}
                </span>
                <span
                  v-if="design.url"
                  class="inline-flex items-center gap-1 text-[0.65rem] terminal-text text-terminal-cyan"
                >
                  <ExternalLink class="w-3 h-3" />
                  Live
                </span>
              </div>
            </div>

            <div class="p-5">
              <h3 class="text-lg font-semibold text-terminal-green group-hover:text-white transition-colors leading-snug">
                {{ design.title }}
              </h3>
              <p class="mt-2 text-sm text-gray-400 leading-relaxed line-clamp-3">{{ design.summary }}</p>

              <div v-if="design.tags?.length" class="mt-4 flex flex-wrap gap-1.5">
                <span
                  v-for="tag in design.tags"
                  :key="tag"
                  class="inline-flex items-center gap-1 rounded-md border border-terminal-cyan/30 bg-terminal-cyan/5 text-terminal-cyan px-2 py-0.5 text-[0.65rem] terminal-text"
                >
                  <Tag class="w-3 h-3" />
                  {{ tag }}
                </span>
              </div>
            </div>
          </button>
        </li>
      </ul>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="active"
          class="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-start sm:items-center justify-center px-3 sm:px-6 pt-[max(2.5rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))] overflow-y-auto overscroll-contain"
          @click="close"
        >
          <div
            class="relative w-full max-w-5xl bg-terminal-dark rounded-2xl neon-border overflow-hidden my-4"
            @click.stop
          >
            <button
              type="button"
              class="absolute top-3 right-3 z-10 inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/70 border border-terminal-green/30 text-terminal-green hover:bg-black hover:border-terminal-green transition-colors touch-manipulation"
              aria-label="Close design preview"
              @click="close"
            >
              <X class="w-5 h-5" />
            </button>

            <div
              class="relative aspect-[16/9] w-full overflow-hidden"
              :class="!active.image ? active.placeholder || 'bg-terminal-green/20' : ''"
            >
              <img
                v-if="active.image"
                :src="active.image"
                :alt="active.title"
                class="w-full h-full object-contain bg-black"
              />
            </div>

            <div class="p-5 sm:p-7">
              <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.7rem] terminal-text text-terminal-green/70 mb-3">
                <span v-if="active.completedAt" class="inline-flex items-center gap-1">
                  <Calendar class="w-3 h-3" />
                  {{ formatDate(active.completedAt) }}
                </span>
                <a
                  v-if="active.url"
                  :href="active.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-terminal-cyan hover:text-terminal-green transition-colors"
                >
                  <ExternalLink class="w-3 h-3" />
                  View live
                </a>
              </div>

              <h3 class="text-2xl sm:text-3xl font-bold text-terminal-green leading-tight">
                {{ active.title }}
              </h3>
              <p class="mt-3 text-sm sm:text-base text-gray-300 leading-relaxed">{{ active.summary }}</p>

              <div v-if="active.tools?.length" class="mt-5">
                <div class="flex items-center gap-2 text-[0.7rem] terminal-text text-terminal-green/70 mb-2">
                  <Wrench class="w-3 h-3" />
                  <span>tools</span>
                </div>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="tool in active.tools"
                    :key="tool"
                    class="rounded-md border border-terminal-purple/30 bg-terminal-purple/5 text-terminal-purple px-2 py-0.5 text-[0.7rem] terminal-text"
                  >
                    {{ tool }}
                  </span>
                </div>
              </div>

              <div v-if="active.tags?.length" class="mt-5">
                <div class="flex items-center gap-2 text-[0.7rem] terminal-text text-terminal-green/70 mb-2">
                  <Tag class="w-3 h-3" />
                  <span>tags</span>
                </div>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="tag in active.tags"
                    :key="tag"
                    class="rounded-md border border-terminal-cyan/30 bg-terminal-cyan/5 text-terminal-cyan px-2 py-0.5 text-[0.7rem] terminal-text"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <div v-if="active.gallery?.length" class="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <img
                  v-for="(src, gi) in active.gallery"
                  :key="gi"
                  :src="src"
                  :alt="`${active.title} — view ${gi + 1}`"
                  loading="lazy"
                  class="rounded-lg border border-terminal-green/20 object-cover aspect-[4/3] w-full"
                />
              </div>

              <div class="mt-8 flex items-center justify-between text-xs terminal-text text-terminal-green/70">
                <button
                  type="button"
                  class="hover:text-terminal-green transition-colors"
                  @click="next(-1)"
                >
                  ← Prev
                </button>
                <span class="text-gray-500">{{ activeIndex + 1 }} / {{ items.length }}</span>
                <button
                  type="button"
                  class="hover:text-terminal-green transition-colors"
                  @click="next(1)"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
