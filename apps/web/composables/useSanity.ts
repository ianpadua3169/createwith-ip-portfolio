import { createClient, type SanityClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

let _client: SanityClient | null = null

export function useSanityClient(): SanityClient {
  if (_client) return _client
  const { public: { sanity } } = useRuntimeConfig()
  _client = createClient({
    projectId: sanity.projectId,
    dataset: sanity.dataset,
    apiVersion: sanity.apiVersion,
    useCdn: sanity.useCdn,
    perspective: 'published'
  })
  return _client
}

export function useSanityImageUrl(source: SanityImageSource | null | undefined) {
  if (!source) return null
  const client = useSanityClient()
  return imageUrlBuilder(client).image(source)
}
