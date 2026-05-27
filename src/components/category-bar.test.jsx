import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CategoryBar } from './category-bar'

const defaultProps = {
  selected: 'all',
  onSelect: vi.fn(),
  onOpenFavorites: vi.fn(),
  favoriteCount: 0,
  onOpenProfile: vi.fn(),
  user: null,
}

describe('CategoryBar', () => {
  it('renders all category buttons', () => {
    render(<CategoryBar {...defaultProps} />)

    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Ambient')).toBeInTheDocument()
    expect(screen.getByText('Classes')).toBeInTheDocument()
    expect(screen.getByText('Solo Trip')).toBeInTheDocument()
    expect(screen.getByText('Guided')).toBeInTheDocument()
    expect(screen.getByText('Satisfying')).toBeInTheDocument()
    expect(screen.getByText('Film Camera')).toBeInTheDocument()
    expect(screen.getByText('Surfing')).toBeInTheDocument()
  })

  it('renders the bookmark button', () => {
    render(<CategoryBar {...defaultProps} />)

    expect(screen.getByLabelText('Open saved videos')).toBeInTheDocument()
  })

  it('renders the profile button', () => {
    render(<CategoryBar {...defaultProps} />)

    expect(screen.getByLabelText('Open profile')).toBeInTheDocument()
  })

  it('calls onSelect when a category is clicked', () => {
    const onSelect = vi.fn()
    render(<CategoryBar {...defaultProps} onSelect={onSelect} />)

    fireEvent.click(screen.getByText('Ambient'))

    expect(onSelect).toHaveBeenCalledWith('ambient')
  })

  it('calls onOpenFavorites when bookmark is clicked', () => {
    const onOpenFavorites = vi.fn()
    render(<CategoryBar {...defaultProps} onOpenFavorites={onOpenFavorites} />)

    fireEvent.click(screen.getByLabelText('Open saved videos'))

    expect(onOpenFavorites).toHaveBeenCalledOnce()
  })

  it('calls onOpenProfile when profile is clicked', () => {
    const onOpenProfile = vi.fn()
    render(<CategoryBar {...defaultProps} onOpenProfile={onOpenProfile} />)

    fireEvent.click(screen.getByLabelText('Open profile'))

    expect(onOpenProfile).toHaveBeenCalledOnce()
  })

  it('shows the favorite count badge when count > 0', () => {
    render(<CategoryBar {...defaultProps} favoriteCount={3} />)

    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('does not show badge when count is 0', () => {
    render(<CategoryBar {...defaultProps} favoriteCount={0} />)

    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })
})
