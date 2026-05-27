import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useOnScreen } from './use-on-screen'

let observerCallback
let observerInstance

class MockIntersectionObserver {
  constructor(callback, options) {
    observerCallback = callback
    observerInstance = this
    this.options = options
    this.observe = vi.fn()
    this.disconnect = vi.fn()
  }
}

beforeEach(() => {
  observerCallback = null
  observerInstance = null
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

describe('useOnScreen', () => {
  it('starts not visible', () => {
    const ref = { current: document.createElement('div') }
    const { result } = renderHook(() => useOnScreen(ref))

    expect(result.current).toBe(false)
  })

  it('observes the ref element', () => {
    const el = document.createElement('div')
    const ref = { current: el }

    renderHook(() => useOnScreen(ref))

    expect(observerInstance.observe).toHaveBeenCalledWith(el)
  })

  it('becomes visible when intersection fires', () => {
    const ref = { current: document.createElement('div') }
    const { result } = renderHook(() => useOnScreen(ref))

    act(() => observerCallback([{ isIntersecting: true }]))

    expect(result.current).toBe(true)
  })

  it('becomes not visible again', () => {
    const ref = { current: document.createElement('div') }
    const { result } = renderHook(() => useOnScreen(ref))

    act(() => observerCallback([{ isIntersecting: true }]))
    act(() => observerCallback([{ isIntersecting: false }]))

    expect(result.current).toBe(false)
  })

  it('uses the provided threshold', () => {
    const ref = { current: document.createElement('div') }

    renderHook(() => useOnScreen(ref, 0.8))

    expect(observerInstance.options).toEqual({ threshold: 0.8 })
  })

  it('disconnects on unmount', () => {
    const ref = { current: document.createElement('div') }
    const { unmount } = renderHook(() => useOnScreen(ref))

    unmount()

    expect(observerInstance.disconnect).toHaveBeenCalled()
  })

  it('handles null ref without crashing', () => {
    const ref = { current: null }

    expect(() => {
      renderHook(() => useOnScreen(ref))
    }).not.toThrow()
  })
})
