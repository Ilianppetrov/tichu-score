import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useTichuGameContext } from '@/contexts/TichuGameContext'
import { RotateCcw, Undo2 } from 'lucide-react'

export function GameControls() {
  
  const { gameState, resetGame, undoLastRound } = useTichuGameContext()
  const [showResetDialog, setShowResetDialog] = useState(false)

  const canUndo = gameState.rounds.length > 0 && gameState.gameStatus !== 'finished'

  const handleResetConfirm = () => {
    resetGame()
    setShowResetDialog(false)
  }

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setShowResetDialog(true)}
          className="flex-1"
          size="sm"
        >
          Reset
        </Button>
        {canUndo && (
          <Button
            variant="outline"
            onClick={undoLastRound}
            className="flex-1"
            size="sm"
          >
            Undo
          </Button>
        )}
      </div>

      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Game</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset the game? This will clear all rounds and scores. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResetDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleResetConfirm}
            >
              Reset Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

