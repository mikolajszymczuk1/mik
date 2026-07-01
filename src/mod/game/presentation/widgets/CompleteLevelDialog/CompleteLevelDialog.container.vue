<template>
  <CompleteLevelDialogUi
    v-model="gameStore.isLevelFinished"
    :elapsed-seconds="gameStore.elapsedSeconds"
    @close="resetGameAction"
  />
</template>

<script lang="ts" setup>
import CompleteLevelDialogUi from '@game/presentation/widgets/CompleteLevelDialog/CompleteLevelDialog.ui.vue'
import { useGameStore } from '@game/store/gameStore'
import { useResetGameCommandAction } from '@game/application/commands/resetGameCommandAction'

const gameStore = useGameStore()

const { resetGameAction } = useResetGameCommandAction()
</script>
