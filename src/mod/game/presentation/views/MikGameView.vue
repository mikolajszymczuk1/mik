<template>
  <div class="bg-background flex h-screen items-center justify-center">
    <div class="flex flex-col gap-4">
      <ControlPanelContainer />
      <GameBoardContainer />
    </div>
  </div>
</template>

<script setup lang="ts">
import GameBoardContainer from '@game/presentation/widgets/GameBoard/GameBoard.container.vue'
import ControlPanelContainer from '@game/presentation/widgets/ControlPanel/ControlPanel.container.vue'
</script>
