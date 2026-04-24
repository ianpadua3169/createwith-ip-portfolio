import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const currentDir = dirname(fileURLToPath(import.meta.url))

/** Vercel sets VERCEL=1; Nitro needs the `vercel` preset + Build Output at repo root for monorepos */
const isVercel = process.env.VERCEL === '1'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      title: 'Ian Padua - Systems & Web Developer | IT Project Manager',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'IT Systems & Web Developer with 25+ years of experience in IT infrastructure, software engineering, and technical education. Expert in bridging legacy systems and modern web architectures.' },
        { name: 'theme-color', content: '#00FF41' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  devtools: { enabled: false },
  nitro: {
    // Hostinger / VPS: node-server + `.output`. Vercel: serverless preset + `.vercel/output` at monorepo root.
    preset: isVercel ? 'vercel' : 'node-server',
    output: {
      dir: isVercel
        ? resolve(currentDir, '../../.vercel/output')
        : resolve(currentDir, '../../.output')
    }
  }
})
