import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFavorites } from './use-favorites'

// Mock auth context to return guest (no user)
vi.mock('../components/auth-context', () => ({
  useAuthContext: () => ({ user: null, loading: false }),
}))

// Mock supabase as null (no env vars)
vi.mock('../utils/supabase', () => ({
  supabase: null,
}))

const STORAGE_KEY = 'calm-scroll-favorites'

beforeEach(() => {
  localStorage.clear()
})

describe('useFavorites', () => {
  it('starts empty when localStorage is empty', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites.size).toBe(0)
  })

  it('adds a favorite', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => result.current.toggleFavorite('video-1'))

    expect(result.current.isFavorite('video-1')).toBe(true)
    expect(result.current.favorites.size).toBe(1)
  })

  it('removes a favorite on second toggle', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => result.current.toggleFavorite('video-1'))
    act(() => result.current.toggleFavorite('video-1'))

    expect(result.current.isFavorite('video-1')).toBe(false)
    expect(result.current.favorites.size).toBe(0)
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => result.current.toggleFavorite('video-1'))
    act(() => result.current.toggleFavorite('video-2'))

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(stored).toContain('video-1')
    expect(stored).toContain('video-2')
    expect(stored).toHaveLength(2)
  })

  it('loads existing favorites from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['video-a', 'video-b']))

    const { result } = renderHook(() => useFavorites())

    expect(result.current.favorites.size).toBe(2)
    expect(result.current.isFavorite('video-a')).toBe(true)
    expect(result.current.isFavorite('video-b')).toBe(true)
  })

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, '{not valid json!!')

    const { result } = renderHook(() => useFavorites())

    expect(result.current.favorites.size).toBe(0)
  })
})
