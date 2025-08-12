
'use client'

import { User } from '../types/game'

interface PlayerAvatarProps {
  user: User
  variant?: 'small' | 'medium' | 'large'
  showName?: boolean
  className?: string
}

export default function PlayerAvatar({ 
  user, 
  variant = 'medium',
  showName = false,
  className = '' 
}: PlayerAvatarProps) {
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-base'
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[variant]} rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white border-2 border-white/20`}>
        {user.profilePictureUrl ? (
          <img 
            src={user.profilePictureUrl} 
            alt={user.username || 'User'} 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span>{(user.username || user.farcasterId)?.[0]?.toUpperCase() || '?'}</span>
        )}
      </div>
      {showName && (
        <span className="text-text font-semibold truncate">
          {user.username || `User ${user.farcasterId.slice(0, 6)}`}
        </span>
      )}
    </div>
  )
}
