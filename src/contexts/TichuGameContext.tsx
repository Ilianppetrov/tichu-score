import { createContext, useContext, ReactNode } from 'react'
import { useTichuGame } from '@/hooks/useTichuGame'

type TichuGameContextType = ReturnType<typeof useTichuGame>

const TichuGameContext = createContext<TichuGameContextType | null>(null)

export function TichuGameProvider({ children }: { children: ReactNode }) {
  const gameHook = useTichuGame()

  return (
    <TichuGameContext.Provider value={gameHook}>
      {children}
    </TichuGameContext.Provider>
  )
}

export function useTichuGameContext() {
  const context = useContext(TichuGameContext)
  if (!context) {
    throw new Error('useTichuGameContext must be used within TichuGameProvider')
  }
  return context
}

