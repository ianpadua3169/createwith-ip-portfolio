<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'

useHead({
  title: 'Designs — Ian Padua',
  meta: [
    {
      name: 'description',
      content:
        'Web graphic designs, UI concepts, editorial covers, and design systems by Ian Padua.'
    }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-terminal-dark pt-[max(1rem,env(safe-area-inset-top,0px))]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-sm text-terminal-green/80 hover:text-terminal-green transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
        <span class="terminal-text">cd ..</span>
      </NuxtLink>
    </div>
    <section class="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-terminal-panel">
      <DesignsGallery />
    </section>
  </div>
</template>
