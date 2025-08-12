'use client'

import { Card } from '../types/game'
import { getSuitSymbol } from '../utils/deck'

interface PlayingCardProps {
  card?: Card
  isRevealed?: boolean
  isCurrentCard?: boolean
  className?: string
  theme?: {
    cardBack: string
    background: string
  }
}

export default function PlayingCard({ 
  card, 
  isRevealed = true, 
  isCurrentCard = false,
  className = '',
  theme
}: PlayingCardProps) {
  if (!card || !isRevealed) {
    return (
      <div 
        className={`game-card ${isCurrentCard ? 'animate-pulse-glow' : ''} ${className}`}
        style={theme ? { background: theme.cardBack } : {}}
      >
        <div className="text-center text-white">
          <div className="text-3xl mb-1">🎴</div>
          <div className="text-xs font-semibold">CHRONO</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`game-card game-card-face ${isCurrentCard ? 'border-accent shadow-glow' : ''} ${className}`}>
      <div className="text-center">
        <div className={`text-2xl font-bold ${card.color === 'red' ? 'text-red-500' : 'text-gray-800'}`}>
          {card.display}
        </div>
        <div className={`text-xl ${card.color === 'red' ? 'text-red-500' : 'text-gray-800'}`}>
          {getSuitSymbol(card.suit)}
        </div>
      </div>
    </div>
  )
}
