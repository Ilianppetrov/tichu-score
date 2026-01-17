
import { Trophy, Users } from 'lucide-react'
import { useTichuGameContext } from '@/contexts/TichuGameContext'
import { Team } from '@/types/tichu'

export function ScoreDisplay() {
  const { gameState, getCurrentDealer, getTeamPlayers } = useTichuGameContext()

  const currentDealer = getCurrentDealer()
  const teamAPlayers = getTeamPlayers(Team.TeamA)
  const teamBPlayers = getTeamPlayers(Team.TeamB)
  const roundNumber = gameState.rounds.length + 1

  const teamAWon = gameState.winner === Team.TeamA
  const teamBWon = gameState.winner === Team.TeamB

  return (
    <div className="space-y-4">
      {/* Dealer Indicator */}
      {currentDealer && (
        <div className="text-center py-3 border-b">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Dealer:</span>
            <span className="font-medium">{currentDealer.name}</span>
          </div>
        </div>
      )}

      {/* Round Number */}
      <div className="text-center py-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">Round</span>
        <div className="text-3xl font-light mt-1">{roundNumber}</div>
      </div>

      {/* Team Scores */}
      <div className="grid grid-cols-2 gap-3">
        {/* Team A */}
        <div
          className={`p-6 rounded-lg border transition-colors ${
            teamAWon
              ? 'border-green-500/50 bg-green-500/5'
              : 'border-border bg-card'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Team A
              </h3>
              {teamAWon && <Trophy className="w-4 h-4 text-yellow-500" />}
            </div>
            <div className="space-y-0.5">
              {teamAPlayers.map((player, idx) => (
                <div key={idx} className="text-xs text-muted-foreground">
                  {player.name}
                </div>
              ))}
            </div>
            <div className="pt-3 border-t">
              <div className="text-5xl font-light tracking-tight">
                {gameState.teamAScore}
              </div>
              {gameState.teamAScore >= 1000 && (
                <div className="text-xs text-green-500 font-medium mt-2 uppercase tracking-wide">
                  Winner
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Team B */}
        <div
          className={`p-6 rounded-lg border transition-colors ${
            teamBWon
              ? 'border-green-500/50 bg-green-500/5'
              : 'border-border bg-card'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Team B
              </h3>
              {teamBWon && <Trophy className="w-4 h-4 text-yellow-500" />}
            </div>
            <div className="space-y-0.5">
              {teamBPlayers.map((player, idx) => (
                <div key={idx} className="text-xs text-muted-foreground">
                  {player.name}
                </div>
              ))}
            </div>
            <div className="pt-3 border-t">
              <div className="text-5xl font-light tracking-tight">
                {gameState.teamBScore}
              </div>
              {gameState.teamBScore >= 1000 && (
                <div className="text-xs text-green-500 font-medium mt-2 uppercase tracking-wide">
                  Winner
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

