import { withBase } from 'ufo'

const CV_FILENAME = 'Ian-Padua-CV.pdf'

export function useCvDownload() {
  const config = useRuntimeConfig()

  const cvHref = computed(() =>
    withBase(`/${CV_FILENAME}`, config.app.baseURL)
  )

  /** Reliable in-app download (fetch blob + object URL). Returns false if the file is missing or blocked. */
  async function downloadAsFile(): Promise<boolean> {
    if (!import.meta.client) return false
    const path = cvHref.value
    try {
      const res = await fetch(path, { credentials: 'same-origin' })
      if (!res.ok) return false
      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = CV_FILENAME
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(objectUrl)
      return true
    } catch {
      return false
    }
  }

  return { cvHref, downloadAsFile }
}
