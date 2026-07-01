import { useGameStore } from '@game/store/gameStore'

export const useFinishLevelCommandAction = () => {
  const gameStore = useGameStore()

  const finishLevelAction = () => {
    gameStore.finishLevel()
  }

  return { finishLevelAction }
}
