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
        <div className="text-center animate-fade-in">
          <div className="relative mb-6">
            <div className="animate-spin w-12 h-12 border-3 border-accent border-t-transparent rounded-full mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl animate-pulse">🎴</div>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Shuffling deck...</h3>
          <p className="text-muted text-sm">Preparing your cards for the ultimate challenge</p>
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Score Display */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="card hover:scale-105 transition-transform duration-200">
          <div className="text-lg font-bold text-accent transition-all duration-300" key={score}>
            {score}
          </div>
          <div className="text-sm text-muted">Score</div>
        </div>
        <div className="card hover:scale-105 transition-transform duration-200">
          <div className={`text-lg font-bold text-primary transition-all duration-300 ${streak > 0 ? 'animate-bounce-in' : ''}`} key={streak}>
            {streak}
          </div>
          <div className="text-sm text-muted">Streak</div>
          {streak >= 3 && (
            <div className="text-xs text-yellow-400 animate-pulse">🔥 Hot!</div>
          )}
        </div>
        <div className="card hover:scale-105 transition-transform duration-200">
          <div className="text-lg font-bold text-text transition-all duration-300" key={deck.length - cardIndex}>
            {deck.length - cardIndex}
          </div>
          <div className="text-sm text-muted">Cards Left</div>
        </div>
      </div>

      {/* Card Display */}
      <div className="flex justify-center items-center space-x-8 px-4">
        <div className="text-center">
          <div className="mb-3 text-sm font-semibold text-muted">Current Card</div>
          <PlayingCard 
            card={currentCard} 
            isCurrentCard={true}
            className="animate-fade-in"
          />
        </div>
        
        {showNextCard && (
          <div className="text-center">
            <div className="mb-3 text-sm font-semibold text-muted">Next Card</div>
            <PlayingCard 
              card={nextCard} 
              className="animate-card-flip"
            />
          </div>
        )}
        
        {!showNextCard && (
          <div className="text-center opacity-30">
            <div className="mb-3 text-sm font-semibold text-muted">Next Card</div>
            <PlayingCard 
              isRevealed={false}
              className="animate-pulse"
            />
          </div>
        )}
      </div>

      {/* Game Result */}
      {gameResult && (
        <div className={`text-center animate-bounce-in ${
          gameResult === 'correct' ? 'text-success' : 'text-error'
        }`}>
          <div className="text-2xl font-bold mb-2">
            {gameResult === 'correct' ? '🎉 Correct!' : '❌ Incorrect!'}
          </div>
          {gameResult === 'correct' && streak > 1 && (
            <div className="text-sm text-accent animate-pulse">
              <div className="font-semibold">{streak} in a row!</div>
              <div className="text-yellow-400">+{streak * 10} bonus points</div>
            </div>
          )}
          {gameResult === 'incorrect' && streak >= 3 && (
            <div className="text-sm text-orange-400 animate-fade-in">
              Streak broken! You were on fire 🔥
            </div>
          )}
        </div>
      )}

      {/* Game Controls */}
      {isGameActive && !showNextCard && (
        <div className="flex space-x-4 justify-center animate-fade-in px-4">
          <button
            onClick={() => makeGuess('lower')}
            className="btn-secondary flex-1 max-w-40 text-center hover:bg-red-500/20 hover:border-red-400/50 hover:scale-105 active:scale-95 transition-all duration-200 focus:ring-2 focus:ring-red-400/50 focus:outline-none py-4 min-h-[60px] touch-manipulation"
            disabled={!isGameActive}
            aria-label="Guess that the next card is lower"
          >
            <div className="text-2xl font-bold mb-1">📉</div>
            <div className="text-sm font-semibold">Lower</div>
          </button>
          
          <button
            onClick={() => makeGuess('higher')}
            className="btn-secondary flex-1 max-w-40 text-center hover:bg-green-500/20 hover:border-green-400/50 hover:scale-105 active:scale-95 transition-all duration-200 focus:ring-2 focus:ring-green-400/50 focus:outline-none py-4 min-h-[60px] touch-manipulation"
            disabled={!isGameActive}
            aria-label="Guess that the next card is higher"
          >
            <div className="text-2xl font-bold mb-1">📈</div>
            <div className="text-sm font-semibold">Higher</div>
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
