
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useMiniKit, useAddFrame, useOpenUrl, useNotification } from '@coinbase/onchainkit/minikit'
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet'
import { Identity, Avatar, Name, Address } from '@coinbase/onchainkit/identity'
import AppHeader from './components/AppHeader'
import GameBoard from './components/GameBoard'
import ChallengeButton from './components/ChallengeButton'
import ThemeSelector from './components/ThemeSelector'
import { GameSession, User, GameTheme, Challenge } from './types/game'

export default function Home() {
  const { setFrameReady, isFrameReady, context } = useMiniKit()
  const openUrl = useOpenUrl()
  const sendNotification = useNotification()
  
  // Game state
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [gameSession, setGameSession] = useState<GameSession | null>(null)
  const [activeTab, setActiveTab] = useState<'play' | 'challenges' | 'themes'>('play')
  const [selectedTheme, setSelectedTheme] = useState('default')
  const [challenges, setChallenges] = useState<Challenge[]>([])

  // Mock themes data
  const themes: GameTheme[] = [
    {
      id: 'default',
      name: 'Classic Blue',
      cardBack: 'linear-gradient(135deg, hsl(220, 60%, 50%), hsl(180, 70%, 45%))',
      background: 'linear-gradient(135deg, hsl(225, 20%, 15%), hsl(220, 20%, 20%))',
      isUnlocked: true
    },
    {
      id: 'royal',
      name: 'Royal Gold',
      cardBack: 'linear-gradient(135deg, #FFD700, #FFA500)',
      background: 'linear-gradient(135deg, #2C1810, #3D2817)',
      isUnlocked: false
    },
    {
      id: 'neon',
      name: 'Neon Nights',
      cardBack: 'linear-gradient(135deg, #FF00FF, #00FFFF)',
      background: 'linear-gradient(135deg, #0A0A0A, #1A0A1A)',
      isUnlocked: false
    }
  ]

  // Initialize frame
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady()
    }
  }, [setFrameReady, isFrameReady])

  // Mock user initialization
  useEffect(() => {
    if (context?.user) {
      const mockUser: User = {
        farcasterId: context.user.fid?.toString() || 'guest',
        baseWalletAddress: context.user.verifications?.[0] || '0x123...',
        profilePictureUrl: context.user.pfpUrl || '',
        cosmeticsOwned: ['default'],
        username: context.user.username || context.user.displayName
      }
      setCurrentUser(mockUser)
    } else {
      // Guest user
      const guestUser: User = {
        farcasterId: 'guest',
        baseWalletAddress: '',
        profilePictureUrl: '',
        cosmeticsOwned: ['default'],
        username: 'Guest Player'
      }
      setCurrentUser(guestUser)
    }
  }, [context])

  const startNewGame = useCallback(() => {
    if (!currentUser) return

    const newSession: GameSession = {
      sessionId: `game_${Date.now()}`,
      userId: currentUser.farcasterId,
      startTime: new Date(),
      score: 0,
      themeUsed: selectedTheme,
      isActive: true,
      currentStreak: 0,
      cards: [],
      currentCardIndex: 0
    }
    setGameSession(newSession)
  }, [currentUser, selectedTheme])

  const handleGameUpdate = useCallback((updatedSession: GameSession) => {
    setGameSession(updatedSession)
  }, [])

  const handleChallenge = useCallback(async (targetUser: string) => {
    if (!currentUser) return

    const newChallenge: Challenge = {
      challengeId: `challenge_${Date.now()}`,
      challengerId: currentUser.farcasterId,
      challengedId: targetUser,
      status: 'pending',
      createdAt: new Date()
    }

    setChallenges(prev => [newChallenge, ...prev])

    // Send notification
    try {
      await sendNotification({
        title: '🎯 Challenge Received!',
        body: `${currentUser.username || 'A player'} challenged you to ChronoCard Clash!`
      })
    } catch (error) {
      console.error('Failed to send notification:', error)
    }
  }, [currentUser, sendNotification])

  const handleThemeChange = useCallback((themeId: string) => {
    setSelectedTheme(themeId)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg to-surface">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* User Profile Section */}
        {currentUser && (
          <div className="card mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white">
                  {currentUser.profilePictureUrl ? (
                    <img 
                      src={currentUser.profilePictureUrl} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span>{currentUser.username?.[0]?.toUpperCase() || '?'}</span>
                  )}
                </div>
                <div>
                  <div className="font-semibold">{currentUser.username}</div>
                  <div className="text-sm text-muted">
                    {currentUser.baseWalletAddress ? 
                      `${currentUser.baseWalletAddress.slice(0, 6)}...${currentUser.baseWalletAddress.slice(-4)}` : 
                      'Guest Player'
                    }
                  </div>
                </div>
              </div>
              
              {!currentUser.baseWalletAddress && (
                <Wallet>
                  <ConnectWallet>
                    <div className="btn-primary text-sm">Connect</div>
                  </ConnectWallet>
                  <WalletDropdown>
                    <WalletDropdownDisconnect />
                  </WalletDropdown>
                </Wallet>
              )}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-surface rounded-lg p-1">
          {(['play', 'challenges', 'themes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${
                activeTab === tab 
                  ? 'bg-primary text-white' 
                  : 'text-muted hover:text-text'
              }`}
            >
              {tab === 'play' && '🎮 Play'}
              {tab === 'challenges' && '🎯 Challenges'}
              {tab === 'themes' && '🎨 Themes'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'play' && (
          <div className="space-y-6">
            {!gameSession || !gameSession.isActive ? (
              <div className="text-center space-y-4">
                <div className="card">
                  <h2 className="text-xl font-bold mb-2">Ready to Play?</h2>
                  <p className="text-muted mb-4">
                    Guess if the next card is higher or lower. Build streaks for bonus points!
                  </p>
                  <button onClick={startNewGame} className="btn-primary w-full">
                    🎴 Start New Game
                  </button>
                </div>
                
                <ChallengeButton 
                  onChallenge={handleChallenge}
                  disabled={!currentUser}
                />
              </div>
            ) : (
              <GameBoard 
                gameSession={gameSession} 
                onGameUpdate={handleGameUpdate}
              />
            )}
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Challenges</h2>
              <ChallengeButton 
                variant="secondary"
                onChallenge={handleChallenge}
                disabled={!currentUser}
              />
            </div>
            
            {challenges.length === 0 ? (
              <div className="card text-center">
                <div className="text-4xl mb-2">🎯</div>
                <p className="text-muted">No challenges yet</p>
                <p className="text-sm text-muted mt-2">
                  Challenge your friends to see who can get the highest score!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {challenges.map((challenge) => (
                  <div key={challenge.challengeId} className="card">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">
                          {challenge.status === 'pending' ? 'Challenge Sent' : challenge.status}
                        </div>
                        <div className="text-sm text-muted">
                          To: {challenge.challengedId}
                        </div>
                      </div>
                      <div className="text-sm text-muted">
                        {challenge.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'themes' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Card Themes</h2>
            <ThemeSelector 
              themes={themes}
              selectedTheme={selectedTheme}
              onThemeChange={handleThemeChange}
              variant="grid"
            />
            
            <div className="card">
              <h3 className="font-semibold mb-2">🔒 Unlock More Themes</h3>
              <p className="text-sm text-muted mb-3">
                Purchase premium themes to customize your game experience!
              </p>
              <button 
                onClick={() => openUrl('https://base.org')}
                className="btn-primary w-full"
              >
                Browse Theme Store
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={() => openUrl('https://base.org')}
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            Built on Base with MiniKit
          </button>
        </div>
      </div>
    </div>
  )
}
