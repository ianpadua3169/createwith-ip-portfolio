<script setup lang="ts">
import { Terminal, ArrowLeft, Calendar, Tag, User } from 'lucide-vue-next'
import type { PortableTextBlock } from '@portabletext/types'

interface PostDetail {
  _id: string
  title: string
  slug: string
  excerpt: string | null
  publishedAt: string | null
  body: PortableTextBlock[] | null
  author: { name: string; slug: string; image: any } | null
  categories: { title: string; slug: string }[]
  mainImage: any | null
}

const route = useRoute()
const slug = String(route.params.slug)

const sanity = useSanityClient()

const { data: post, error } = await useAsyncData<PostDetail | null>(`blog-post-${slug}`, () =>
  sanity.fetch<PostDetail | null>(
    `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      body,
      mainImage,
      "author": author->{ name, "slug": slug.current, image },
      "categories": categories[]->{ title, "slug": slug.current }
    }`,
    { slug }
  )
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return ''
  }
}

const mainImageUrl = computed(() => {
  if (!post.value?.mainImage) return null
  return useSanityImageUrl(post.value.mainImage)?.width(1600).height(900).fit('crop').auto('format').url() ?? null
})

const authorImageUrl = computed(() => {
  if (!post.value?.author?.image) return null
  return useSanityImageUrl(post.value.author.image)?.width(80).height(80).fit('crop').auto('format').url() ?? null
})

useHead(() => ({
  title: post.value ? `${post.value.title} — Ian Padua` : 'Blog',
  meta: [
    {
      name: 'description',
      content: post.value?.excerpt || 'Blog post published from Sanity CMS.'
    },
    { property: 'og:title', content: post.value?.title || 'Blog' },
    { property: 'og:description', content: post.value?.excerpt || '' },
    ...(mainImageUrl.value ? [{ property: 'og:image', content: mainImageUrl.value }] : [])
  ]
}))
</script>

<template>
  <div class="min-h-screen bg-terminal-dark pt-[max(1rem,env(safe-area-inset-top,0px))]">
    <article class="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div class="max-w-3xl mx-auto">
        <NuxtLink to="/blog"
                  class="inline-flex items-center gap-2 text-sm text-terminal-green/80 hover:text-terminal-green transition-colors mb-8">
          <ArrowLeft class="w-4 h-4" />
          <span class="terminal-text">cd ../blog</span>
        </NuxtLink>

        <div v-if="error" class="border border-red-500/30 bg-red-500/5 text-red-300 rounded-lg p-4 terminal-text text-sm">
          Failed to load this post.
        </div>

        <template v-else-if="post">
          <div class="flex items-center gap-2 text-xs terminal-text text-terminal-green/70 mb-4">
            <Terminal class="w-4 h-4" />
            <span>~/blog/{{ post.slug }} $ cat post.md</span>
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold neon-glow leading-tight mb-4">
            {{ post.title }}
          </h1>

          <p v-if="post.excerpt" class="text-lg text-gray-300 leading-relaxed mb-6">
            {{ post.excerpt }}
          </p>

          <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs terminal-text text-terminal-green/70 mb-6">
            <span v-if="post.publishedAt" class="inline-flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5" />
              {{ formatDate(post.publishedAt) }}
            </span>
            <span v-if="post.author" class="inline-flex items-center gap-2">
              <img v-if="authorImageUrl" :src="authorImageUrl" :alt="post.author.name"
                   class="w-6 h-6 rounded-full border border-terminal-green/40 object-cover" />
              <User v-else class="w-3.5 h-3.5" />
              <span>{{ post.author.name }}</span>
            </span>
          </div>

          <div v-if="post.categories?.length" class="flex flex-wrap items-center gap-2 mb-8">
            <span v-for="cat in post.categories" :key="cat.slug"
                  class="inline-flex items-center gap-1 rounded-md border border-terminal-cyan/30 bg-terminal-cyan/5 text-terminal-cyan px-2 py-0.5 text-[0.7rem] terminal-text">
              <Tag class="w-3 h-3" />
              {{ cat.title }}
            </span>
          </div>

          <div v-if="mainImageUrl" class="mb-10 rounded-xl overflow-hidden border border-terminal-green/20">
            <img :src="mainImageUrl" :alt="post.title" class="w-full h-auto" />
          </div>

          <PostBody :value="post.body" />

          <div class="mt-16 pt-8 border-t border-terminal-green/20 flex items-center justify-between text-xs terminal-text text-terminal-green/70">
            <NuxtLink to="/blog" class="hover:text-terminal-green transition-colors">← More posts</NuxtLink>
            <NuxtLink to="/" class="hover:text-terminal-green transition-colors">Home</NuxtLink>
          </div>
        </template>
      </div>
    </article>
  </div>
</template>
