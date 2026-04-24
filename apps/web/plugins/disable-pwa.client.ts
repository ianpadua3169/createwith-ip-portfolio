/**
 * This site is NOT a PWA. Some older deployments shipped a service worker
 * or web manifest which browsers may still have cached, causing an
 * "Install app" affordance to appear (e.g., on dev.createwith-ip.com).
 *
 * This plugin runs on every client navigation and:
 *  - Unregisters any previously installed service workers
 *  - Clears CacheStorage entries those SWs populated
 *  - Suppresses Chrome's `beforeinstallprompt` so the install UI never appears
 */
export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
  })

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().catch(() => {})
        }
      })
      .catch(() => {})
  }

  if (typeof caches !== 'undefined' && caches?.keys) {
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k).catch(() => false))))
      .catch(() => {})
  }
})
