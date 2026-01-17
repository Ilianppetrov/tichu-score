export enum Team {
  TeamA = 'TeamA',
  TeamB = 'TeamB',
}

export type TichuCall = 'Tichu' | 'GrandTichu' | 'None'

export interface Player {
  name: string
  team: Team
}

export interface PlayerTichuCall {
  playerIndex: number // Index in the players array (0-3)
  call: TichuCall
  success: boolean | null // null if not called, true/false after round ends
}

export interface RoundResult {
  teamAScore: number
  teamBScore: number
  playerTichuCalls: PlayerTichuCall[] // One entry per player who called Tichu
  doubleVictory: boolean
  doubleVictoryTeam: Team | null // Which team won the double victory
}

export interface GameState {
  players: Player[]
  teamAScore: number
  teamBScore: number
  rounds: RoundResult[]
  currentDealerIndex: number
  gameStatus: 'notStarted' | 'inProgress' | 'finished'
  winner: Team | null
}

