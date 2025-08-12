
'use client'

import { useState, useCallback } from 'react'
import { User, Challenge } from '../types/game'

interface ChallengeButtonProps {
  variant?: 'primary' | 'secondary'
  onChallenge?: (targetUser: string) => void
  disabled?: boolean
}

export default function ChallengeButton({ 
  variant = 'primary',
  onChallenge,
  disabled = false 
}: ChallengeButtonProps) {
  const [showChallengeModal, setShowChallengeModal] = useState(false)
  const [targetUser, setTargetUser] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChallenge = useCallback(async () => {
    if (!targetUser.trim() || !onChallenge) return
    
    setIsLoading(true)
    try {
      await onChallenge(targetUser.trim())
      setShowChallengeModal(false)
      setTargetUser('')
    } catch (error) {
      console.error('Failed to send challenge:', error)
    } finally {
      setIsLoading(false)
    }
  }, [targetUser, onChallenge])

  const buttonClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary'

  return (
    <>
      <button
        onClick={() => setShowChallengeModal(true)}
        disabled={disabled}
        className={`${buttonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        🎯 Challenge Friend
      </button>

      {/* Challenge Modal */}
      {showChallengeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full animate-slide-up">
            <h3 className="text-lg font-bold mb-4">Challenge a Friend</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-muted mb-2">
                  Farcaster ID or Wallet Address
                </label>
                <input
                  type="text"
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                  placeholder="Enter username or 0x..."
                  className="input-field w-full"
                  disabled={isLoading}
                />
              </div>
              
              <div className="text-sm text-muted">
                Challenge your friend to see who can get the highest score!
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleChallenge}
                  disabled={!targetUser.trim() || isLoading}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send Challenge'}
                </button>
                <button
                  onClick={() => {
                    setShowChallengeModal(false)
                    setTargetUser('')
                  }}
                  disabled={isLoading}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
