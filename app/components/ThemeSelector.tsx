'use client'

import { useState } from 'react'
import { GameTheme } from '../types/game'

interface ThemeSelectorProps {
  themes: GameTheme[]
  selectedTheme: string
  onThemeChange: (themeId: string) => void
  variant?: 'carousel' | 'grid'
}

export default function ThemeSelector({ 
  themes, 
  selectedTheme, 
  onThemeChange,
  variant = 'carousel' 
}: ThemeSelectorProps) {
  const [currentIndex, setCurrentIndex] = useState(
    themes.findIndex(t => t.id === selectedTheme) || 0
  )

  const nextTheme = () => {
    const newIndex = (currentIndex + 1) % themes.length
    setCurrentIndex(newIndex)
    onThemeChange(themes[newIndex].id)
  }

  const prevTheme = () => {
    const newIndex = currentIndex === 0 ? themes.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    onThemeChange(themes[newIndex].id)
  }

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-3">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => theme.isUnlocked && onThemeChange(theme.id)}
            disabled={!theme.isUnlocked}
            aria-label={`Select ${theme.name} theme${!theme.isUnlocked ? ' (locked)' : ''}`}
            aria-pressed={selectedTheme === theme.id}
            className={`card-interactive text-left relative focus:outline-none focus:ring-2 focus:ring-accent/50 ${
              selectedTheme === theme.id ? 'border-accent shadow-glow ring-2 ring-accent/30' : ''
            } ${!theme.isUnlocked ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`}
          >
            <div className="aspect-video rounded-md mb-2 bg-gradient-to-br"
                 style={{ background: theme.background }}>
              <div className="p-2">
                <div className="w-6 h-8 rounded-sm bg-white/20 border border-white/30"></div>
              </div>
            </div>
            <div className="text-sm font-semibold">{theme.name}</div>
            {!theme.isUnlocked && (
              <div className="absolute top-2 right-2">
                🔒
              </div>
            )}
          </button>
        ))}
      </div>
    )
  }

  // Carousel variant
  const currentTheme = themes[currentIndex]

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={prevTheme}
          aria-label="Previous theme"
          className="btn-secondary w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          ←
        </button>
        
        <div className="flex-1 mx-4 text-center">
          <div className="aspect-video rounded-md mb-2 bg-gradient-to-br mx-auto max-w-32"
               style={{ background: currentTheme.background }}>
            <div className="p-2">
              <div className="w-4 h-6 rounded-sm bg-white/20 border border-white/30"></div>
            </div>
          </div>
          <div className="font-semibold">{currentTheme.name}</div>
          {!currentTheme.isUnlocked && (
            <div className="text-sm text-muted">🔒 Locked</div>
          )}
        </div>
        
        <button 
          onClick={nextTheme}
          aria-label="Next theme"
          className="btn-secondary w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          →
        </button>
      </div>
      
      <button
        onClick={() => currentTheme.isUnlocked && onThemeChange(currentTheme.id)}
        disabled={!currentTheme.isUnlocked || selectedTheme === currentTheme.id}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {selectedTheme === currentTheme.id ? 'Current Theme' : 'Select Theme'}
      </button>
    </div>
  )
}
