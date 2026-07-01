<template>
  <GameTimerUi
    :elapsed-seconds="elapsedSeconds"
    :is-running="isGameRunning"
    @action-tick="handleTick"
  />
</template>

<script lang="ts" setup>
import { useIncrementGameTimeCommandAction } from '@game/application/commands/incrementGameTimeCommandAction'
import { useGameStore } from '@game/store/gameStore'
import GameTimerUi from '@game/presentation/widgets/GameTimer/GameTimer.ui.vue'
import { storeToRefs } from 'pinia'

const gameStore = useGameStore()
const { elapsedSeconds, isGameRunning } = storeToRefs(gameStore)
const { incrementGameTimeAction } = useIncrementGameTimeCommandAction()

const handleTick = (): void => {
  incrementGameTimeAction()
}
</script>
