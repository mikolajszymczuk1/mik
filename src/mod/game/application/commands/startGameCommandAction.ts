import { useGameStore } from '@game/store/gameStore'

export const useStartGameCommandAction = () => {
  const gameStore = useGameStore()

  const startGameAction = () => {
    gameStore.startGame()
  }

  return { startGameAction }
}
