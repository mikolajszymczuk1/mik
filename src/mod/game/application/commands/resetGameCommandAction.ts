import { useGameStore } from '@game/store/gameStore'

export const useResetGameCommandAction = () => {
  const gameStore = useGameStore()

  const resetGameAction = () => {
    gameStore.resetGame()
  }

  return { resetGameAction }
}
