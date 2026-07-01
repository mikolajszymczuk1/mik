import { defineStore } from 'pinia'
import { type Ref, ref, readonly } from 'vue'

export const useGameStore = defineStore('gameStore', () => {
  const isGameRunning: Ref<boolean> = ref(false)
  const isLevelFinished: Ref<boolean> = ref(false)
  const reset: Ref<boolean> = ref(false)
  const elapsedSeconds: Ref<number> = ref(0)

  const mutations = {
    SET_IS_GAME_RUNNING: (value: boolean): void => {
      isGameRunning.value = value
    },

    SET_IS_LEVEL_FINISHED: (value: boolean): void => {
      isLevelFinished.value = value
    },

    TOGGLE_RESET: (): void => {
      reset.value = !reset.value
    },

    SET_ELAPSED_SECONDS: (value: number): void => {
      elapsedSeconds.value = value
    },
  }

  const startGame = (): void => {
    mutations.SET_IS_GAME_RUNNING(true)
    mutations.SET_IS_LEVEL_FINISHED(false)
  }

  const finishLevel = (): void => {
    mutations.SET_IS_GAME_RUNNING(false)
    mutations.SET_IS_LEVEL_FINISHED(true)
  }

  const resetGame = (): void => {
    mutations.SET_IS_GAME_RUNNING(false)
    mutations.SET_IS_LEVEL_FINISHED(false)
    mutations.SET_ELAPSED_SECONDS(0)
    mutations.TOGGLE_RESET()
  }

  const incrementGameTime = (): void => {
    mutations.SET_ELAPSED_SECONDS(elapsedSeconds.value + 1)
  }

  const resetGameTime = (): void => {
    mutations.SET_ELAPSED_SECONDS(0)
  }

  return {
    isGameRunning: readonly(isGameRunning),
    isLevelFinished: readonly(isLevelFinished),
    reset: readonly(reset),
    elapsedSeconds: readonly(elapsedSeconds),

    startGame,
    finishLevel,
    resetGame,
    incrementGameTime,
    resetGameTime,
  }
})
