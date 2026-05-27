import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VideoCard } from './video-card'

vi.mock('../hooks/use-on-screen', () => ({
  useOnScreen: () => false,
}))

vi.mock('../hooks/use-youtube-player', () => ({
  useYouTubePlayer: () => ({
    ready: false,
    muted: true,
    error: null,
    toggleMute: vi.fn(),
  }),
}))

const VIDEO = {
  id: 'test-01',
  youtubeId: 'dQw4w9WgXcQ',
  title: 'Test Video Title',
  creator: 'Test Creator',
  category: 'ambient',
  duration: 300,
}

beforeEach(() => {
  localStorage.clear()
})

describe('VideoCard', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <VideoCard
        video={VIDEO}
        isFavorite={false}
        onToggleFavorite={vi.fn()}
        isFirst={false}
      />,
    )

    expect(container.querySelector('section')).toBeInTheDocument()
  })

  it('displays the video title', () => {
    render(
      <VideoCard
        video={VIDEO}
        isFavorite={false}
        onToggleFavorite={vi.fn()}
        isFirst={false}
      />,
    )

    expect(screen.getByText('Test Video Title')).toBeInTheDocument()
  })

  it('displays the creator', () => {
    render(
      <VideoCard
        video={VIDEO}
        isFavorite={false}
        onToggleFavorite={vi.fn()}
        isFirst={false}
      />,
    )

    expect(screen.getByText('Test Creator')).toBeInTheDocument()
  })

  it('displays the category label', () => {
    render(
      <VideoCard
        video={VIDEO}
        isFavorite={false}
        onToggleFavorite={vi.fn()}
        isFirst={false}
      />,
    )

    expect(screen.getByText('Ambient')).toBeInTheDocument()
  })

  it('shows mute button with Unmute label when muted', () => {
    render(
      <VideoCard
        video={VIDEO}
        isFavorite={false}
        onToggleFavorite={vi.fn()}
        isFirst={false}
        isMuted={true}
        onToggleMute={vi.fn()}
      />,
    )

    expect(screen.getByLabelText('Unmute')).toBeInTheDocument()
  })

  it('shows Add to favorites label when not favorited', () => {
    render(
      <VideoCard
        video={VIDEO}
        isFavorite={false}
        onToggleFavorite={vi.fn()}
        isFirst={false}
      />,
    )

    expect(screen.getByLabelText('Add to favorites')).toBeInTheDocument()
  })

  it('shows Remove from favorites label when favorited', () => {
    render(
      <VideoCard
        video={VIDEO}
        isFavorite={true}
        onToggleFavorite={vi.fn()}
        isFirst={false}
      />,
    )

    expect(screen.getByLabelText('Remove from favorites')).toBeInTheDocument()
  })
})
