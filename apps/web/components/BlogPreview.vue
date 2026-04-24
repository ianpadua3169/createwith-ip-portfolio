<script setup lang="ts">
import { BookOpen, ArrowRight, Calendar } from 'lucide-vue-next'

interface BlogPostPreview {
  _id: string
  title: string
  slug: string
  excerpt: string
  publishedAt: string
  author: { name: string } | null
}

const sanity = useSanityClient()

const { data: posts } = await useAsyncData<BlogPostPreview[]>('blog-preview', () =>
  sanity.fetch<BlogPostPreview[]>(
    `*[_type == "post" && defined(slug.current)] | order(coalesce(publishedAt, _updatedAt) desc)[0...3]{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      "author": author->{ name }
    }`
  ),
  { default: () => [] }
)

function formatDate(iso: string | undefined) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}
</script>

<template>
  <section v-if="posts && posts.length" class="py-24 px-4 sm:px-6 lg:px-8 bg-terminal-dark">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div>
          <div class="flex items-center gap-2 terminal-text text-terminal-green/70 text-xs sm:text-sm mb-3">
            <BookOpen class="w-4 h-4" />
            <span>~/blog $ head -n 3 posts.md</span>
          </div>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold neon-glow">Latest from the blog</h2>
          <p class="mt-3 text-gray-400 max-w-2xl">
            Articles published from Sanity CMS, queried with GROQ, and rendered by Nuxt.
          </p>
        </div>
        <NuxtLink to="/blog"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-terminal-green/40 text-terminal-green hover:bg-terminal-green/10 transition-colors terminal-text text-sm">
          View all posts
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <NuxtLink v-for="post in posts" :key="post._id" :to="`/blog/${post.slug}`"
                  class="group flex flex-col rounded-xl border border-terminal-green/20 bg-terminal-panel/60 hover:border-terminal-green/60 hover:bg-terminal-panel/90 transition-all p-6">
          <div class="flex items-center gap-2 text-[0.7rem] terminal-text text-terminal-green/60 mb-3">
            <Calendar class="w-3 h-3" />
            <span>{{ formatDate(post.publishedAt) }}</span>
            <span v-if="post.author" class="text-gray-500">· {{ post.author.name }}</span>
          </div>
          <h3 class="text-lg sm:text-xl font-semibold text-terminal-green group-hover:text-white transition-colors mb-2 leading-snug">
            {{ post.title }}
          </h3>
          <p v-if="post.excerpt" class="text-sm text-gray-400 leading-relaxed line-clamp-4 flex-1">
            {{ post.excerpt }}
          </p>
          <div class="mt-5 inline-flex items-center gap-1 text-xs terminal-text text-terminal-green/80 group-hover:text-terminal-green">
            Read post
            <ArrowRight class="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
