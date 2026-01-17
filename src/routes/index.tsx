import { createFileRoute } from '@tanstack/react-router'
import { PlayerSetup } from '@/components/tichu/PlayerSetup'
import { ScoreDisplay } from '@/components/tichu/ScoreDisplay'
import { RoundForm } from '@/components/tichu/RoundForm'
import { RoundHistory } from '@/components/tichu/RoundHistory'
import { GameControls } from '@/components/tichu/GameControls'
import { TichuGameProvider, useTichuGameContext } from '@/contexts/TichuGameContext'


export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <TichuGameProvider>
      <AppContent />
    </TichuGameProvider>
  )
}

function AppContent() {
  const { gameState, initializeGame } = useTichuGameContext()

  // Show player setup if game hasn't started
  if (gameState.gameStatus === 'notStarted') {
    return (
      <div className="min-h-screen bg-background">
        <PlayerSetup onStart={initializeGame} />
      </div>
    )
  }

  // Show main game view
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="space-y-5">
          <ScoreDisplay />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <RoundForm />
            <div className="space-y-5">
              <RoundHistory />
              <GameControls />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}