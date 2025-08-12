
import { Card } from '../types/game'

export function createShuffledDeck(): Card[] {
  const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades']
  const deck: Card[] = []
  
  suits.forEach(suit => {
    for (let value = 1; value <= 13; value++) {
      let display: string
      switch (value) {
        case 1:
          display = 'A'
          break
        case 11:
          display = 'J'
          break
        case 12:
          display = 'Q'
          break
        case 13:
          display = 'K'
          break
        default:
          display = value.toString()
      }
      
      deck.push({
        suit,
        value,
        display,
        color: suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black'
      })
    }
  })
  
  // Shuffle the deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  
  return deck
}

export function getSuitSymbol(suit: Card['suit']): string {
  switch (suit) {
    case 'hearts':
      return '♥'
    case 'diamonds':
      return '♦'
    case 'clubs':
      return '♣'
    case 'spades':
      return '♠'
    default:
      return ''
  }
}

export function compareCards(card1: Card, card2: Card): 'higher' | 'lower' | 'equal' {
  if (card1.value > card2.value) return 'higher'
  if (card1.value < card2.value) return 'lower'
  return 'equal'
}
