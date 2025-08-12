
'use client'

import { Card } from '../types/game'
import { getSuitSymbol } from '../utils/deck'

interface PlayingCardProps {
  card?: Card
  isRevealed?: boolean
  isCurrentCard?: boolean
  className?: string
}

export default function PlayingCard({ 
  card, 
  isRevealed = true, 
  isCurrentCard = false,
  className = '' 
}: PlayingCardProps) {
  if (!card || !isRevealed) {
    return (
      <div className={`game-card game-card-back ${isCurrentCard ? 'animate-pulse-glow' : ''} ${className}`}>
        <div className="text-center">
          <div className="text-3xl mb-1">🎴</div>
          <div className="text-xs">CHRONO</div>
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
