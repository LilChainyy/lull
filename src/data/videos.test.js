import { describe, it, expect } from 'vitest'
import videos from './videos.json'

const VALID_CATEGORIES = ['ambient', 'classes', 'guided', 'satisfying', 'filmcamera', 'surfing', 'solotrip']
const REQUIRED_FIELDS = ['id', 'youtubeId', 'title', 'creator', 'category', 'duration']

describe('videos.json', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(videos)).toBe(true)
    expect(videos.length).toBeGreaterThan(0)
  })

  it('has no duplicate IDs', () => {
    const ids = videos.map((v) => v.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has no duplicate YouTube IDs', () => {
    const ytIds = videos.map((v) => v.youtubeId)
    expect(new Set(ytIds).size).toBe(ytIds.length)
  })

  it('every entry has all required fields', () => {
    videos.forEach((video) => {
      REQUIRED_FIELDS.forEach((field) => {
        expect(video, `${video.id} missing "${field}"`).toHaveProperty(field)
      })
    })
  })

  it('every entry has a valid category', () => {
    videos.forEach((video) => {
      expect(
        VALID_CATEGORIES,
        `${video.id} has invalid category "${video.category}"`,
      ).toContain(video.category)
    })
  })

  it('every ID is a non-empty string', () => {
    videos.forEach((video) => {
      expect(typeof video.id).toBe('string')
      expect(video.id.length).toBeGreaterThan(0)
    })
  })

  it('every youtubeId is a non-empty string', () => {
    videos.forEach((video) => {
      expect(typeof video.youtubeId).toBe('string')
      expect(video.youtubeId.length).toBeGreaterThan(0)
    })
  })

  it('every duration is a non-negative number', () => {
    videos.forEach((video) => {
      expect(typeof video.duration).toBe('number')
      expect(video.duration).toBeGreaterThanOrEqual(0)
    })
  })

  it('has at least one entry per category', () => {
    VALID_CATEGORIES.forEach((cat) => {
      const count = videos.filter((v) => v.category === cat).length
      expect(count, `no entries for category "${cat}"`).toBeGreaterThan(0)
    })
  })
})
