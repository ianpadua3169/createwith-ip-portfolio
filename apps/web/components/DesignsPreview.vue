<script setup lang="ts">
import { Palette, ArrowRight } from 'lucide-vue-next'
import { designs } from '~/data/designs'

const hasDesigns = computed(() => designs.length > 0)
</script>

<template>
  <section v-if="hasDesigns" class="py-24 px-4 sm:px-6 lg:px-8 bg-terminal-dark">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div>
          <div class="flex items-center gap-2 terminal-text text-terminal-green/70 text-xs sm:text-sm mb-3">
            <Palette class="w-4 h-4" />
            <span>~/designs $ ls --recent</span>
          </div>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold neon-glow">Selected designs</h2>
          <p class="mt-3 text-gray-400 max-w-2xl">
            UI concepts, editorial covers, and design systems from recent web work.
          </p>
        </div>
        <NuxtLink
          to="/designs"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-terminal-green/40 text-terminal-green hover:bg-terminal-green/10 transition-colors terminal-text text-sm"
        >
          Open gallery
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
      </div>

      <DesignsGallery :limit="3" headless />
    </div>
  </section>
</template>
