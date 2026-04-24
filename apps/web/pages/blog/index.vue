<script setup lang="ts">
import { Terminal, ArrowLeft, Calendar, Tag, ArrowRight } from 'lucide-vue-next'

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  publishedAt: string
  author: { name: string; slug: string } | null
  categories: { title: string; slug: string }[]
}

const sanity = useSanityClient()

const { data: posts, pending, error } = await useAsyncData<BlogPost[]>('blog-index', () =>
  sanity.fetch<BlogPost[]>(`*[_type == "post" && defined(slug.current)] | order(coalesce(publishedAt, _updatedAt) desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "author": author->{ name, "slug": slug.current },
    "categories": categories[]->{ title, "slug": slug.current }
  }`)
)

function formatDate(iso: string | undefined) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

useHead({
  title: 'Blog — Ian Padua',
  meta: [
    { name: 'description', content: 'Articles on systems, web engineering, and the Philippine tech scene, published from Sanity CMS.' }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-terminal-dark pt-[max(1rem,env(safe-area-inset-top,0px))]">
    <section class="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div class="max-w-5xl mx-auto">
        <NuxtLink to="/"
                  class="inline-flex items-center gap-2 text-sm text-terminal-green/80 hover:text-terminal-green transition-colors mb-8">
          <ArrowLeft class="w-4 h-4" />
          <span class="terminal-text">cd ..</span>
        </NuxtLink>

        <div class="flex items-center gap-3 mb-4">
          <Terminal class="w-6 h-6 text-terminal-green" />
          <span class="terminal-text text-sm text-terminal-green/70">~/blog $ ls --latest</span>
        </div>

        <h1 class="text-4xl sm:text-5xl font-bold neon-glow mb-4">Blog</h1>
        <p class="text-gray-400 max-w-2xl mb-12">
          Notes on systems, web engineering, and the Philippine job market. Published from Sanity CMS and rendered with Nuxt and GROQ.
        </p>

        <div v-if="pending" class="text-terminal-green/70 terminal-text">Loading posts…</div>

        <div v-else-if="error"
             class="border border-red-500/30 bg-red-500/5 text-red-300 rounded-lg p-4 terminal-text text-sm">
          Failed to load posts. Try again shortly.
        </div>

        <div v-else-if="!posts || posts.length === 0" class="text-gray-400 terminal-text">
          No posts published yet.
        </div>

        <ul v-else class="space-y-4">
          <li v-for="post in posts" :key="post._id">
            <NuxtLink :to="`/blog/${post.slug}`"
                      class="block group relative rounded-xl border border-terminal-green/20 bg-terminal-panel/40 hover:border-terminal-green/60 hover:bg-terminal-panel/70 transition-all p-5 sm:p-6">
              <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.7rem] terminal-text text-terminal-green/60 mb-2">
                <span v-if="post.publishedAt" class="inline-flex items-center gap-1">
                  <Calendar class="w-3 h-3" />
                  {{ formatDate(post.publishedAt) }}
                </span>
                <span v-if="post.author" class="text-gray-500">by {{ post.author.name }}</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-semibold text-terminal-green group-hover:text-white transition-colors">
                {{ post.title }}
              </h2>
              <p v-if="post.excerpt" class="mt-2 text-sm sm:text-base text-gray-400 leading-relaxed">
                {{ post.excerpt }}
              </p>
              <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div v-if="post.categories?.length" class="flex flex-wrap items-center gap-2">
                  <span v-for="cat in post.categories" :key="cat.slug"
                        class="inline-flex items-center gap-1 rounded-md border border-terminal-cyan/30 bg-terminal-cyan/5 text-terminal-cyan px-2 py-0.5 text-[0.65rem] terminal-text">
                    <Tag class="w-3 h-3" />
                    {{ cat.title }}
                  </span>
                </div>
                <span class="inline-flex items-center gap-1 text-xs terminal-text text-terminal-green/80 group-hover:text-terminal-green">
                  cat post
                  <ArrowRight class="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
