import { defineStore } from 'pinia'
import { type Ref, ref, readonly } from 'vue'

export const useGameStore = defineStore('gameStore', () => {
  const isGameRunning: Ref<boolean> = ref(false)
  const isLevelFinished: Ref<boolean> = ref(false)

  const mutations = {
    SET_IS_GAME_RUNNING: (value: boolean): void => {
      isGameRunning.value = value
    },

    SET_IS_LEVEL_FINISHED: (value: boolean): void => {
      isLevelFinished.value = value
    },
  }

  const startGame = (): void => {
    mutations.SET_IS_GAME_RUNNING(true)
    mutations.SET_IS_LEVEL_FINISHED(false)
  }

  const finishLevel = (): void => {
    mutations.SET_IS_LEVEL_FINISHED(true)
  }

  const resetGame = (): void => {
    mutations.SET_IS_GAME_RUNNING(false)
    mutations.SET_IS_LEVEL_FINISHED(false)
  }

  return {
    isGameRunning: readonly(isGameRunning),
    isLevelFinished: readonly(isLevelFinished),

    startGame,
    finishLevel,
    resetGame,
  }
})
