import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useTichuGameContext } from '@/contexts/TichuGameContext'
import type { TichuCall, PlayerTichuCall } from '@/types/tichu'
import { Team } from '@/types/tichu'

export function RoundForm() {
  const { gameState, recordRound } = useTichuGameContext()
  const teamAPointsInputRef = useRef<HTMLInputElement>(null)

  const [teamACardPoints, setTeamACardPoints] = useState('')
  const [teamBCardPoints, setTeamBCardPoints] = useState('')
  // Track Tichu calls per player (index 0-3)
  const [playerTichuCalls, setPlayerTichuCalls] = useState<Map<number, TichuCall>>(new Map())
  const [playerTichuSuccess, setPlayerTichuSuccess] = useState<Map<number, boolean | null>>(
    new Map(),
  )
  const [doubleVictory, setDoubleVictory] = useState(false)
  const [doubleVictoryTeam, setDoubleVictoryTeam] = useState<Team | null>(null)
  const [tichuCallsRecorded, setTichuCallsRecorded] = useState(false)

  // Focus the first input when score entry form appears
  useEffect(() => {
    if (tichuCallsRecorded && teamAPointsInputRef.current) {
      // Small delay to ensure the form is rendered
      setTimeout(() => {
        teamAPointsInputRef.current?.focus()
      }, 0)
    }
  }, [tichuCallsRecorded])

  const handleTichuCallsSubmit = () => {
    // Mark Tichu calls as recorded
    setTichuCallsRecorded(true)
  }

  const handlePlayerTichuCall = (playerIndex: number, call: TichuCall) => {
    const newCalls = new Map(playerTichuCalls)
    const newSuccess = new Map(playerTichuSuccess)

    if (call === 'None') {
      newCalls.delete(playerIndex)
      newSuccess.delete(playerIndex)
    } else {
      newCalls.set(playerIndex, call)
      newSuccess.set(playerIndex, null) // Reset success/failure when changing call
    }

    setPlayerTichuCalls(newCalls)
    setPlayerTichuSuccess(newSuccess)
  }

  const handlePlayerTichuSuccess = (playerIndex: number, success: boolean) => {
    const newSuccess = new Map(playerTichuSuccess)
    newSuccess.set(playerIndex, success)
    setPlayerTichuSuccess(newSuccess)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const teamAPoints = parseInt(teamACardPoints) || 0
    const teamBPoints = parseInt(teamBCardPoints) || 0

    // Validate points (must sum to 100 unless double victory)
    if (!doubleVictory && teamAPoints + teamBPoints !== 100) {
      alert(`Card points must sum to 100 (currently ${teamAPoints + teamBPoints})`)
      return
    }

    // Validate double victory team is set if double victory is checked
    if (doubleVictory && !doubleVictoryTeam) {
      alert('Please select which team won the double victory')
      return
    }

    // Validate Tichu success/failure is set for all players who called Tichu
    for (const [playerIndex, call] of playerTichuCalls.entries()) {
      if (call !== 'None' && playerTichuSuccess.get(playerIndex) === null) {
        const player = gameState.players[playerIndex]
        alert(
          `Please indicate whether ${player?.name || `Player ${playerIndex + 1}`}'s ${call === 'GrandTichu' ? 'Grand ' : ''}Tichu call succeeded or failed`,
        )
        return
      }
    }

    // Build playerTichuCalls array
    const playerTichuCallsArray: PlayerTichuCall[] = []
    for (const [playerIndex, call] of playerTichuCalls.entries()) {
      if (call !== 'None') {
        playerTichuCallsArray.push({
          playerIndex,
          call,
          success: playerTichuSuccess.get(playerIndex) ?? null,
        })
      }
    }

    recordRound({
      teamAScore: teamAPoints,
      teamBScore: teamBPoints,
      playerTichuCalls: playerTichuCallsArray,
      doubleVictory,
      doubleVictoryTeam: doubleVictory ? doubleVictoryTeam : null,
    })

    // Reset form
    setTeamACardPoints('')
    setTeamBCardPoints('')
    setPlayerTichuCalls(new Map())
    setPlayerTichuSuccess(new Map())
    setDoubleVictory(false)
    setDoubleVictoryTeam(null)
    setTichuCallsRecorded(false)
  }

  const handleTeamBCardPointsChange = (value: string) => {
    setTeamBCardPoints(value)
    // Auto-calculate Team B points if Team A is set
    if (teamACardPoints && !doubleVictory) {
      const teamAPoints = parseInt(teamACardPoints) || 0
      if (teamAPoints <= 100) {
        setTeamBCardPoints((100 - teamAPoints).toString())
      }
    }
  }

  const handleTeamACardPointsChange = (value: string) => {
    setTeamACardPoints(value)
    // Auto-calculate Team B points
    if (!doubleVictory) {
      const teamAPoints = parseInt(value) || 0
      if (teamAPoints <= 100) {
        setTeamBCardPoints((100 - teamAPoints).toString())
      } else {
        setTeamBCardPoints('')
      }
    }
  }

  if (gameState.gameStatus === 'finished') {
    return null
  }

  if (gameState.players.length !== 4) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">
          {!tichuCallsRecorded ? 'Tichu Calls' : 'Round Score'}
        </CardTitle>
        {!tichuCallsRecorded && (
          <CardDescription className="text-xs">
            Record calls at the start of the round
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {!tichuCallsRecorded ? (
          // Step 1: Tichu Calls
          <div className="space-y-4">
            {/* Tichu Calls - Per Player */}
            <div className="space-y-3">
              {gameState.players.map((player, index) => {
                const currentCall = playerTichuCalls.get(index) || 'None'
                return (
                  <div key={index} className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {player.name}
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={currentCall === 'None' ? 'default' : 'outline'}
                        onClick={() => handlePlayerTichuCall(index, 'None')}
                        size="sm"
                        className="flex-1"
                      >
                        None
                      </Button>
                      <Button
                        type="button"
                        variant={currentCall === 'Tichu' ? 'default' : 'outline'}
                        onClick={() => handlePlayerTichuCall(index, 'Tichu')}
                        size="sm"
                        className="flex-1"
                      >
                        Tichu
                      </Button>
                      <Button
                        type="button"
                        variant={currentCall === 'GrandTichu' ? 'default' : 'outline'}
                        onClick={() => handlePlayerTichuCall(index, 'GrandTichu')}
                        size="sm"
                        className="flex-1"
                      >
                        Grand
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            <Button
              type="button"
              onClick={handleTichuCallsSubmit}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        ) : (
          // Step 2: Score Entry
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tichu Call Success/Failure */}
            {playerTichuCalls.size > 0 && (
              <div className="space-y-3 pb-4 border-b">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Tichu Results
                </Label>
                {Array.from(playerTichuCalls.entries()).map(([playerIndex, call]) => {
                  const player = gameState.players[playerIndex]
                  const success = playerTichuSuccess.get(playerIndex)
                  if (!player || call === 'None') return null

                  return (
                    <div key={playerIndex} className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        {player.name} ({call === 'GrandTichu' ? 'Grand ' : ''}Tichu)
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={success === true ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePlayerTichuSuccess(playerIndex, true)}
                          className="flex-1"
                        >
                          ✓
                        </Button>
                        <Button
                          type="button"
                          variant={success === false ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePlayerTichuSuccess(playerIndex, false)}
                          className="flex-1"
                        >
                          ✗
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Card Points */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="teamA-points" className="text-xs text-muted-foreground uppercase tracking-wide">
                  Team A Points
                </Label>
                <Input
                  ref={teamAPointsInputRef}
                  id="teamA-points"
                  type="number"
                  min="0"
                  max="100"
                  value={teamACardPoints}
                  onChange={(e) => handleTeamACardPointsChange(e.target.value)}
                  disabled={doubleVictory}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="teamB-points" className="text-xs text-muted-foreground uppercase tracking-wide">
                  Team B Points
                </Label>
                <Input
                  id="teamB-points"
                  type="number"
                  min="0"
                  max="100"
                  value={teamBCardPoints}
                  onChange={(e) => handleTeamBCardPointsChange(e.target.value)}
                  disabled={doubleVictory}
                  required
                />
              </div>
            </div>

            {/* Double Victory */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="double-victory"
                  checked={doubleVictory}
                  onCheckedChange={(checked) => {
                    setDoubleVictory(checked === true)
                    if (checked) {
                      setTeamACardPoints('')
                      setTeamBCardPoints('')
                    } else {
                      setDoubleVictoryTeam(null)
                    }
                  }}
                />
                <Label htmlFor="double-victory" className="cursor-pointer text-sm">
                  Double Victory
                </Label>
              </div>
              {doubleVictory && (
                <div className="ml-6 space-y-2">
                  <div className="flex gap-3">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="double-victory-team"
                        checked={doubleVictoryTeam === Team.TeamA}
                        onChange={() => setDoubleVictoryTeam(Team.TeamA)}
                        className="w-4 h-4"
                      />
                      <span className="text-xs">Team A</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="double-victory-team"
                        checked={doubleVictoryTeam === Team.TeamB}
                        onChange={() => setDoubleVictoryTeam(Team.TeamB)}
                        className="w-4 h-4"
                      />
                      <span className="text-xs">Team B</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setTichuCallsRecorded(false)}
                className="flex-1"
                size="sm"
              >
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Record
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
