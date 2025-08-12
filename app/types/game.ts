
export interface User {
  farcasterId: string
  baseWalletAddress: string
  profilePictureUrl: string
  cosmeticsOwned: string[]
  username?: string
}

export interface GameSession {
  sessionId: string
  userId: string
  startTime: Date
  endTime?: Date
  score: number
  themeUsed: string
  isActive: boolean
  currentStreak: number
  cards: Card[]
  currentCardIndex: number
}

export interface Challenge {
  challengeId: string
  challengerId: string
  challengedId: string
  status: 'pending' | 'accepted' | 'declined' | 'completed'
  gameSessionId?: string
  createdAt: Date
  challengerScore?: number
  challengedScore?: number
}

export interface CosmeticItem {
  itemId: string
  name: string
  description: string
  imageUrl: string
  type: 'theme' | 'card_back' | 'avatar'
  price: number
  isOwned?: boolean
}

export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades'
  value: number // 1-13 (Ace=1, Jack=11, Queen=12, King=13)
  display: string
  color: 'red' | 'black'
}

export type GameTheme = {
  id: string
  name: string
  cardBack: string
  background: string
  isUnlocked: boolean
}
