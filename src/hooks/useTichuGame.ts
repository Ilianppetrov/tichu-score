import { useCallback, useEffect, useState } from 'react'
import type { GameState, Player, RoundResult } from '@/types/tichu'
import { Team } from '@/types/tichu'

const STORAGE_KEY = 'tichu-game-state'

const initialGameState: GameState = {
  players: [],
  teamAScore: 0,
  teamBScore: 0,
  rounds: [],
  currentDealerIndex: 0,
  gameStatus: 'notStarted',
  winner: null,
}

function loadGameState(): GameState {
  if (typeof window === 'undefined') {
    return initialGameState
  }
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored) as GameState
    } catch (error) {
      console.error('Failed to parse stored game state:', error)
      return initialGameState
    }
  }
  return initialGameState
}

export function useTichuGame() {
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on client-side mount
  useEffect(() => {
    const loadedState = loadGameState()
    setGameState(loadedState)
    setIsHydrated(true)
  }, [])

  // Save to localStorage whenever gameState changes (only after hydration)
  useEffect(() => {
    if (isHydrated && gameState.gameStatus !== 'notStarted') {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState))
      }
    }
  }, [gameState, isHydrated])

  const initializeGame = useCallback((players: Array<Player>) => {
    if (players.length !== 4) {
      throw new Error('Must have exactly 4 players')
    }

    const newState: GameState = {
      players,
      teamAScore: 0,
      teamBScore: 0,
      rounds: [],
      currentDealerIndex: 0,
      gameStatus: 'inProgress',
      winner: null,
    }

    setGameState(newState)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
    }
  }, [])

  const recordRound = useCallback(
    (roundResult: RoundResult) => {
      if (gameState.gameStatus !== 'inProgress') {
        return
      }

      // Calculate scores
      let teamAScore = roundResult.teamAScore
      let teamBScore = roundResult.teamBScore

      // Apply Tichu bonuses/penalties per player
      for (const playerTichu of roundResult.playerTichuCalls) {
        if (playerTichu.call !== 'None' && playerTichu.success !== null) {
          const player = gameState.players[playerTichu.playerIndex]
          if (!player) continue

          const tichuPoints = playerTichu.call === 'GrandTichu' ? 200 : 100
          if (playerTichu.success) {
            // Success: add points to player's team
            if (player.team === Team.TeamA) {
              teamAScore += tichuPoints
            } else {
              teamBScore += tichuPoints
            }
          } else {
            // Failure: subtract points from player's team
            if (player.team === Team.TeamA) {
              teamAScore -= tichuPoints
            } else {
              teamBScore -= tichuPoints
            }
          }
        }
      }

      // Handle double victory
      if (roundResult.doubleVictory && roundResult.doubleVictoryTeam) {
        if (roundResult.doubleVictoryTeam === Team.TeamA) {
          teamAScore = 200
          teamBScore = 0
        } else {
          teamAScore = 0
          teamBScore = 200
        }
      }

      const newTeamAScore = gameState.teamAScore + teamAScore
      const newTeamBScore = gameState.teamBScore + teamBScore

      // Rotate dealer to next player
      const nextDealerIndex = (gameState.currentDealerIndex + 1) % 4

      // Check for game end
      const winner =
        newTeamAScore >= 1000
          ? Team.TeamA
          : newTeamBScore >= 1000
            ? Team.TeamB
            : null

      const newState: GameState = {
        ...gameState,
        teamAScore: newTeamAScore,
        teamBScore: newTeamBScore,
        rounds: [...gameState.rounds, roundResult],
        currentDealerIndex: nextDealerIndex,
        gameStatus: winner ? 'finished' : 'inProgress',
        winner,
      }

      setGameState(newState)
    },
    [gameState],
  )

  const resetGame = useCallback(() => {
    setGameState(initialGameState)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const undoLastRound = useCallback(() => {
    if (gameState.rounds.length === 0) {
      return
    }

    // Remove last round
    const newRounds = gameState.rounds.slice(0, -1)

    // Recalculate scores from remaining rounds
    let teamAScore = 0
    let teamBScore = 0

    for (const round of newRounds) {
      let roundTeamAScore = round.teamAScore
      let roundTeamBScore = round.teamBScore

      // Apply Tichu bonuses/penalties per player
      for (const playerTichu of round.playerTichuCalls) {
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

      if (round.doubleVictory && round.doubleVictoryTeam) {
        if (round.doubleVictoryTeam === Team.TeamA) {
          roundTeamAScore = 200
          roundTeamBScore = 0
        } else {
          roundTeamAScore = 0
          roundTeamBScore = 200
        }
      }

      teamAScore += roundTeamAScore
      teamBScore += roundTeamBScore
    }

    // Rotate dealer back
    const prevDealerIndex = (gameState.currentDealerIndex - 1 + 4) % 4

    const newState: GameState = {
      ...gameState,
      teamAScore,
      teamBScore,
      rounds: newRounds,
      currentDealerIndex: prevDealerIndex,
      gameStatus: 'inProgress',
      winner: null,
    }

    setGameState(newState)
  }, [gameState])

  const getCurrentDealer = useCallback((): Player | null => {
    if (gameState.players.length === 0) {
      return null
    }
    return gameState.players[gameState.currentDealerIndex] || null
  }, [gameState.players, gameState.currentDealerIndex])

  const getTeamPlayers = useCallback(
    (team: Team): Array<Player> => {
      return gameState.players.filter((p) => p.team === team)
    },
    [gameState.players],
  )

  return {
    gameState,
    initializeGame,
    recordRound,
    resetGame,
    undoLastRound,
    getCurrentDealer,
    getTeamPlayers,
  }
}

