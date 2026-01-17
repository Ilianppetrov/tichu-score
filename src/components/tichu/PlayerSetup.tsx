import { useState } from 'react'
import type { Player } from '@/types/tichu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Team } from '@/types/tichu'

interface PlayerSetupProps {
  onStart: (players: Array<Player>) => void
}

export function PlayerSetup({ onStart }: PlayerSetupProps) {
  const [teamAPlayer1, setTeamAPlayer1] = useState('')
  const [teamAPlayer2, setTeamAPlayer2] = useState('')
  const [teamBPlayer1, setTeamBPlayer1] = useState('')
  const [teamBPlayer2, setTeamBPlayer2] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Arrange players in seating order around the table (alternating teams)
    // Player 1 (Team A) starts as dealer, then rotates to the right
    const players: Array<Player> = [
      { name: teamAPlayer1.trim(), team: Team.TeamA }, // Position 1 - starts as dealer
      { name: teamBPlayer1.trim(), team: Team.TeamB }, // Position 2 - to the right
      { name: teamAPlayer2.trim(), team: Team.TeamA }, // Position 3 - to the right
      { name: teamBPlayer2.trim(), team: Team.TeamB }, // Position 4 - to the right
    ]

    // Validate all names are filled
    if (players.some((p) => !p.name)) {
      alert('Please enter all player names')
      return
    }

    // Validate no duplicate names
    const names = players.map((p) => p.name.toLowerCase())
    if (new Set(names).size !== names.length) {
      alert('Player names must be unique')
      return
    }

    onStart(players)
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-light tracking-tight">Tichu</h1>
          <p className="text-sm text-muted-foreground">Enter player names to start</p>
        </div>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Team A
                  </Label>
                  <div className="space-y-2">
                    <Input
                      id="teamA-player1"
                      value={teamAPlayer1}
                      onChange={(e) => setTeamAPlayer1(e.target.value)}
                      placeholder="Player 1"
                      required
                    />
                    <Input
                      id="teamA-player2"
                      value={teamAPlayer2}
                      onChange={(e) => setTeamAPlayer2(e.target.value)}
                      placeholder="Player 2"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Team B
                  </Label>
                  <div className="space-y-2">
                    <Input
                      id="teamB-player1"
                      value={teamBPlayer1}
                      onChange={(e) => setTeamBPlayer1(e.target.value)}
                      placeholder="Player 1"
                      required
                    />
                    <Input
                      id="teamB-player2"
                      value={teamBPlayer2}
                      onChange={(e) => setTeamBPlayer2(e.target.value)}
                      placeholder="Player 2"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Start Game
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

