import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      title: 'Ian Padua - Systems & Web Developer | IT Project Manager',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'IT Systems & Web Developer with 25+ years of experience in IT infrastructure, software engineering, and technical education. Expert in bridging legacy systems and modern web architectures.' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  devtools: { enabled: false },
  nitro: {
    preset: 'node-server',
    // Monorepo: emit to repo-root /dist so Hostinger (expected output dir) finds the build
    output: {
      dir: resolve(currentDir, '../../dist')
    }
  }
})
