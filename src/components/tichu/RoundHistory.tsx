import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTichuGameContext } from '@/contexts/TichuGameContext'
import { Team } from '@/types/tichu'

export function RoundHistory() {
  const { gameState } = useTichuGameContext()

  if (gameState.rounds.length === 0) {
    return null
  }

  // Calculate running totals
  let runningTeamAScore = 0
  let runningTeamBScore = 0

  const roundsWithTotals = gameState.rounds.map((round, index) => {
    let roundTeamAScore = round.teamAScore
    let roundTeamBScore = round.teamBScore

    // Handle double victory first (sets base scores to 200/0)
    if (round.doubleVictory && round.doubleVictoryTeam) {
      if (round.doubleVictoryTeam === Team.TeamA) {
        roundTeamAScore = 200
        roundTeamBScore = 0
      } else {
        roundTeamAScore = 0
        roundTeamBScore = 200
      }
    }

    // Apply Tichu bonuses/penalties per player (on top of double victory if applicable)
    for (const playerTichu of round.playerTichuCalls || []) {
      if (playerTichu.call !== 'None' && playerTichu.success !== null) {
        const player = gameState.players[playerTichu.playerIndex]
        if (!player) continue

        const tichuPoints = playerTichu.call === 'GrandTichu' ? 200 : 100
        if (playerTichu.success) {
          if (player.team === Team.TeamA) {
            roundTeamAScore += tichuPoints
          } else {
            roundTeamBScore += tichuPoints
          }
        } else {
          if (player.team === Team.TeamA) {
            roundTeamAScore -= tichuPoints
          } else {
            roundTeamBScore -= tichuPoints
          }
        }
      }
    }

    runningTeamAScore += roundTeamAScore
    runningTeamBScore += roundTeamBScore

    return {
      ...round,
      roundNumber: index + 1,
      roundTeamAScore,
      roundTeamBScore,
      runningTeamAScore,
      runningTeamBScore,
    }
  })

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {roundsWithTotals.map((round) => (
            <div
              key={round.roundNumber}
              className="pb-4 border-b last:border-b-0 last:pb-0"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Round {round.roundNumber}
                </span>
                {round.doubleVictory && round.doubleVictoryTeam && (
                  <span className="text-xs text-muted-foreground">
                    {round.doubleVictoryTeam === Team.TeamA ? 'Team A' : 'Team B'} Double
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Team A</div>
                  <div className="text-xl font-light">
                    {round.roundTeamAScore > 0 ? '+' : ''}
                    {round.roundTeamAScore}
                  </div>
                  {(round.playerTichuCalls || [])
                    .filter((ptc) => {
                      const player = gameState.players[ptc.playerIndex]
                      return player?.team === Team.TeamA && ptc.call !== 'None'
                    })
                    .map((ptc, idx) => {
                      const player = gameState.players[ptc.playerIndex]
                      return (
                        <div key={idx} className="text-xs text-muted-foreground">
                          {player?.name} {ptc.call === 'GrandTichu' ? 'Grand' : ''} Tichu
                          {ptc.success !== null && (ptc.success ? ' ✓' : ' ✗')}
                        </div>
                      )
                    })}
                  <div className="text-xs text-muted-foreground pt-1">
                    Total: {round.runningTeamAScore}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Team B</div>
                  <div className="text-xl font-light">
                    {round.roundTeamBScore > 0 ? '+' : ''}
                    {round.roundTeamBScore}
                  </div>
                  {(round.playerTichuCalls || [])
                    .filter((ptc) => {
                      const player = gameState.players[ptc.playerIndex]
                      return player?.team === Team.TeamB && ptc.call !== 'None'
                    })
                    .map((ptc, idx) => {
                      const player = gameState.players[ptc.playerIndex]
                      return (
                        <div key={idx} className="text-xs text-muted-foreground">
                          {player?.name} {ptc.call === 'GrandTichu' ? 'Grand' : ''} Tichu
                          {ptc.success !== null && (ptc.success ? ' ✓' : ' ✗')}
                        </div>
                      )
                    })}
                  <div className="text-xs text-muted-foreground pt-1">
                    Total: {round.runningTeamBScore}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

