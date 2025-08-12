
'use client'

import { useAddFrame, useClose, useMiniKit } from '@coinbase/onchainkit/minikit'
import { useCallback } from 'react'

export default function AppHeader() {
  const { context } = useMiniKit()
  const addFrame = useAddFrame()
  const close = useClose()

  const handleAddFrame = useCallback(async () => {
    const result = await addFrame()
    if (result) {
      console.log('Frame added:', result.url, result.token)
    }
  }, [addFrame])

  return (
    <header className="flex justify-between items-center p-4 bg-surface/50 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-md flex items-center justify-center">
          <span className="text-white font-bold text-sm">CC</span>
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          ChronoCard Clash
        </h1>
      </div>
      
      <div className="flex items-center space-x-2">
        {context && !context.client.added && (
          <button
            onClick={handleAddFrame}
            className="bg-accent hover:bg-accent/90 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
          >
            SAVE FRAME
          </button>
        )}
        <button
          onClick={close}
          className="text-muted hover:text-text text-sm font-semibold transition-colors"
        >
          CLOSE
        </button>
      </div>
    </header>
  )
}
