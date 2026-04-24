<script setup lang="ts">
import { h } from 'vue'
import { PortableText, type PortableTextComponents } from '@portabletext/vue'
import type { PortableTextBlock } from '@portabletext/types'

interface Props {
  value: PortableTextBlock[] | undefined | null
}

const props = defineProps<Props>()

const components: PortableTextComponents = {
  block: {
    normal: (_, { slots }) => h('p', { class: 'text-terminal-green/90 leading-relaxed mb-5' }, slots.default?.()),
    h1: (_, { slots }) => h('h1', { class: 'text-3xl sm:text-4xl font-bold text-terminal-green mt-10 mb-5' }, slots.default?.()),
    h2: (_, { slots }) => h('h2', { class: 'text-2xl sm:text-3xl font-bold text-terminal-green mt-10 mb-4' }, slots.default?.()),
    h3: (_, { slots }) => h('h3', { class: 'text-xl sm:text-2xl font-semibold text-terminal-cyan mt-8 mb-3' }, slots.default?.()),
    h4: (_, { slots }) => h('h4', { class: 'text-lg font-semibold text-terminal-cyan mt-6 mb-2' }, slots.default?.()),
    blockquote: (_, { slots }) =>
      h(
        'blockquote',
        { class: 'border-l-2 border-terminal-green/60 pl-4 italic text-terminal-green/80 my-6' },
        slots.default?.()
      )
  },
  list: {
    bullet: (_, { slots }) =>
      h('ul', { class: 'list-disc list-outside pl-6 my-5 space-y-2 text-terminal-green/90' }, slots.default?.()),
    number: (_, { slots }) =>
      h('ol', { class: 'list-decimal list-outside pl-6 my-5 space-y-2 text-terminal-green/90' }, slots.default?.())
  },
  listItem: {
    bullet: (_, { slots }) => h('li', { class: 'leading-relaxed' }, slots.default?.()),
    number: (_, { slots }) => h('li', { class: 'leading-relaxed' }, slots.default?.())
  },
  marks: {
    strong: (_, { slots }) => h('strong', { class: 'font-semibold text-terminal-green' }, slots.default?.()),
    em: (_, { slots }) => h('em', { class: 'italic' }, slots.default?.()),
    code: (_, { slots }) =>
      h(
        'code',
        { class: 'bg-terminal-panel/80 text-terminal-cyan px-1.5 py-0.5 rounded text-[0.9em]' },
        slots.default?.()
      ),
    link: ({ value }, { slots }) => {
      const href: string = value?.href || '#'
      const external = /^https?:\/\//i.test(href)
      return h(
        'a',
        {
          href,
          class: 'text-terminal-cyan underline underline-offset-4 hover:text-terminal-green transition-colors',
          target: external ? '_blank' : undefined,
          rel: external ? 'noopener noreferrer' : undefined
        },
        slots.default?.()
      )
    }
  }
}
</script>

<template>
  <div v-if="value && value.length" class="post-body">
    <PortableText :value="value" :components="components" />
  </div>
</template>
