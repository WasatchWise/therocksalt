// Unsplash API integration for fetching band photos
// Uses the official Unsplash API: https://unsplash.com/developers

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || 'demo'

interface UnsplashPhoto {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  alt_description: string | null
  user: {
    name: string
    username: string
    links: {
      html: string
    }
  }
  links: {
    html: string
  }
}

export async function searchBandPhotos(bandName: string, count = 4): Promise<UnsplashPhoto[]> {
  try {
    // Build search query - look for music/band related images
    const query = `${bandName} band music live concert`

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
        next: { revalidate: 86400 } // Cache for 24 hours
      }
    )

    if (!response.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Unsplash API error:', response.statusText)
      }
      return []
    }

    const data = await response.json()
    return data.results || []
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching Unsplash photos:', error)
    }
    return []
  }
}

export function getPhotoAttribution(photo: UnsplashPhoto): string {
  return `Photo by ${photo.user.name} on Unsplash`
}

export function getPhotoUrl(photo: UnsplashPhoto, size: 'thumb' | 'small' | 'regular' | 'full' = 'regular'): string {
  return photo.urls[size]
}

// Trigger a download ping to Unsplash (required by their API guidelines)
export async function triggerDownload(photo: UnsplashPhoto): Promise<void> {
  try {
    const downloadUrl = photo.links.html + '/download'
    await fetch(downloadUrl, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      }
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error triggering Unsplash download:', error)
    }
  }
}
