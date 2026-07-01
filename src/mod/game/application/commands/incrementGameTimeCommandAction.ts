import { useGameStore } from '@game/store/gameStore'

export const useIncrementGameTimeCommandAction = () => {
  const gameStore = useGameStore()

  const incrementGameTimeAction = () => {
    gameStore.incrementGameTime()
  }

  return { incrementGameTimeAction }
}
