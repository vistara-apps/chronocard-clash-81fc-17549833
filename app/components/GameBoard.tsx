
'use client'

import { useState, useEffect, useCallback } from 'react'
import { GameSession, Card } from '../types/game'
import { createShuffledDeck, compareCards } from '../utils/deck'
import PlayingCard from './PlayingCard'
import { usePrimaryButton } from '@coinbase/onchainkit/minikit'

interface GameBoardProps {
  gameSession: GameSession
  onGameUpdate: (session: GameSession) => void
}

export default function GameBoard({ gameSession, onGameUpdate }: GameBoardProps) {
  const [currentCard, setCurrentCard] = useState<Card | null>(null)
  const [nextCard, setNextCard] = useState<Card | null>(null)
  const [showNextCard, setShowNextCard] = useState(false)
  const [gameResult, setGameResult] = useState<'correct' | 'incorrect' | null>(null)
  const [deck, setDeck] = useState<Card[]>([])
  const [cardIndex, setCardIndex] = useState(0)
  const [streak, setStreak] = useState(0)
  const [score, setScore] = useState(0)
  const [isGameActive, setIsGameActive] = useState(true)

  // Initialize deck and first card
  useEffect(() => {
    const newDeck = createShuffledDeck()
    setDeck(newDeck)
    setCurrentCard(newDeck[0])
    setCardIndex(1)
  }, [])

  // Primary button for game control
  usePrimaryButton(
    { 
      text: isGameActive ? 'End Game' : 'New Game',
      disabled: !currentCard 
    },
    () => {
      if (isGameActive) {
        endGame()
      } else {
        startNewGame()
      }
    }
  )

  const startNewGame = useCallback(() => {
    const newDeck = createShuffledDeck()
    setDeck(newDeck)
    setCurrentCard(newDeck[0])
    setCardIndex(1)
    setStreak(0)
    setScore(0)
    setShowNextCard(false)
    setGameResult(null)
    setIsGameActive(true)
  }, [])

  const endGame = useCallback(() => {
    setIsGameActive(false)
    const updatedSession: GameSession = {
      ...gameSession,
      score,
      currentStreak: streak,
      isActive: false,
      endTime: new Date()
    }
    onGameUpdate(updatedSession)
  }, [gameSession, score, streak, onGameUpdate])

  const makeGuess = useCallback((guess: 'higher' | 'lower') => {
    if (!currentCard || cardIndex >= deck.length || !isGameActive) return

    const next = deck[cardIndex]
    setNextCard(next)
    setShowNextCard(true)

    const comparison = compareCards(next, currentCard)
    const isCorrect = 
      (guess === 'higher' && comparison === 'higher') ||
      (guess === 'lower' && comparison === 'lower') ||
      comparison === 'equal' // Ties are treated as correct

    setGameResult(isCorrect ? 'correct' : 'incorrect')

    if (isCorrect) {
      const newStreak = streak + 1
      const newScore = score + (newStreak * 10) // Bonus points for streaks
      setStreak(newStreak)
      setScore(newScore)
    } else {
      setStreak(0)
      if (streak < 3) {
        // Game continues for streaks less than 3
      } else {
        // End game on incorrect guess with good streak
        setTimeout(() => endGame(), 2000)
        return
      }
    }

    // Move to next card after delay
    setTimeout(() => {
      if (cardIndex + 1 >= deck.length) {
        // Deck finished - end game
        endGame()
      } else {
        setCurrentCard(next)
        setCardIndex(cardIndex + 1)
        setShowNextCard(false)
        setGameResult(null)
      }
    }, 2000)
  }, [currentCard, cardIndex, deck, isGameActive, streak, score, endGame])

  if (!currentCard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted">Shuffling deck...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Score Display */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="card">
          <div className="text-lg font-bold text-accent">{score}</div>
          <div className="text-sm text-muted">Score</div>
        </div>
        <div className="card">
          <div className="text-lg font-bold text-primary">{streak}</div>
          <div className="text-sm text-muted">Streak</div>
        </div>
        <div className="card">
          <div className="text-lg font-bold text-text">{deck.length - cardIndex}</div>
          <div className="text-sm text-muted">Cards Left</div>
        </div>
      </div>

      {/* Card Display */}
      <div className="flex justify-center space-x-6">
        <div className="text-center">
          <div className="mb-2 text-sm font-semibold text-muted">Current Card</div>
          <PlayingCard 
            card={currentCard} 
            isCurrentCard={true}
            className="animate-fade-in"
          />
        </div>
        
        {showNextCard && (
          <div className="text-center">
            <div className="mb-2 text-sm font-semibold text-muted">Next Card</div>
            <PlayingCard 
              card={nextCard} 
              className="animate-card-flip"
            />
          </div>
        )}
      </div>

      {/* Game Result */}
      {gameResult && (
        <div className={`text-center text-lg font-bold animate-fade-in ${
          gameResult === 'correct' ? 'text-success' : 'text-error'
        }`}>
          {gameResult === 'correct' ? '🎉 Correct!' : '❌ Incorrect!'}
          {gameResult === 'correct' && streak > 1 && (
            <div className="text-sm text-accent mt-1">
              {streak} in a row! +{streak * 10} bonus points
            </div>
          )}
        </div>
      )}

      {/* Game Controls */}
      {isGameActive && !showNextCard && (
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => makeGuess('lower')}
            className="btn-secondary flex-1 max-w-32 text-center hover:bg-error/20 hover:border-error/50"
            disabled={!isGameActive}
          >
            <div className="text-lg font-bold">📉</div>
            <div className="text-sm">Lower</div>
          </button>
          
          <button
            onClick={() => makeGuess('higher')}
            className="btn-secondary flex-1 max-w-32 text-center hover:bg-success/20 hover:border-success/50"
            disabled={!isGameActive}
          >
            <div className="text-lg font-bold">📈</div>
            <div className="text-sm">Higher</div>
          </button>
        </div>
      )}

      {/* Game Over Screen */}
      {!isGameActive && (
        <div className="card text-center animate-slide-up">
          <h3 className="text-xl font-bold mb-2">Game Over!</h3>
          <p className="text-muted mb-4">
            Final Score: <span className="text-accent font-bold">{score}</span>
          </p>
          <p className="text-sm text-muted">
            Best Streak: <span className="text-primary">{streak}</span>
          </p>
        </div>
      )}
    </div>
  )
}
