const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'ambient', label: 'Ambient' },
  { key: 'wisdom', label: 'Wisdom' },
  { key: 'guided', label: 'Guided' },
  { key: 'satisfying', label: 'Satisfying' },
  { key: 'filmcamera', label: 'Film Camera' },
  { key: 'surfing', label: 'Surfing' },
]

export function CategoryBar({ selected, onSelect, onOpenFavorites, favoriteCount, onOpenProfile, user }) {
  return (
    <nav
      className="fixed top-0 inset-x-0 z-30 flex items-center gap-2 px-4 pb-3 bg-black/40 backdrop-blur-md"
      style={{ paddingTop: 'calc(0.75rem + env(safe-area-inset-top))' }}
    >
      {CATEGORIES.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`px-3.5 min-h-[44px] rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
            selected === key
              ? 'bg-white text-black'
              : 'bg-white/10 text-white/70 active:bg-white/20'
          }`}
        >
          {label}
        </button>
      ))}

      {/* Spacer pushes bookmark to the right */}
      <div className="flex-1" />

      {/* Favorites / bookmark button */}
      <button
        onClick={onOpenFavorites}
        className="relative flex items-center justify-center w-11 h-11 rounded-full active:scale-90 transition-transform"
        aria-label="Open saved videos"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white/70">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
        </svg>
        {favoriteCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
            {favoriteCount}
          </span>
        )}
      </button>

      {/* Profile button */}
      <button
        onClick={onOpenProfile}
        className="relative flex items-center justify-center w-11 h-11 rounded-full active:scale-90 transition-transform"
        aria-label="Open profile"
      >
        {user?.user_metadata?.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt="Profile"
            className="w-6 h-6 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white/70">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        )}
      </button>
    </nav>
  )
}
