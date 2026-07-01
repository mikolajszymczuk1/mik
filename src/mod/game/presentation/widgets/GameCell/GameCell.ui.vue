<template>
  <div
    class="bg-game-cell-background shadow-game-cell hover:shadow-game-cell-hover active:shadow-game-cell-active flex h-16 w-16 cursor-pointer items-center justify-center rounded-xl border-2 transition-all duration-150 ease-out hover:-translate-y-1.25 active:translate-y-0.5"
    :class="cell.active ? 'border-game-accent' : 'border-game-cell-border'"
    :data-x="cell.x"
    :data-y="cell.y"
    style="touch-action: none"
    @pointerdown.prevent="emit('cell-down', position)"
  >
    <div
      v-if="cell.landNumber != -1"
      class="flex h-8 w-8 items-center justify-center rounded-full border"
      :class="[
        cell.active
          ? 'bg-game-accent border-none shadow-none'
          : 'border-game-accent shadow-base bg-game-land-background',
        !cell.active ? 'land-float' : '',
      ]"
    >
      <BaseText :text="`${cell.active ? '' : cell.landNumber}`" size="small" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import BaseText from '@shared/presentation/ui/base/text/BaseText.vue'
import type Cell from '@game/domain/models/Cell'
import { type Position } from '@game/domain/types/Position.type'
import { computed } from 'vue'

interface Props {
  cell: Cell
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'cell-down': [position: Position]
}>()

const position = computed<Position>(() => ({ x: props.cell.x, y: props.cell.y }))
</script>

<style scoped>
.land-float {
  animation: land-float 0.6s ease-in-out infinite alternate;
}

@keyframes land-float {
  from {
    transform: translateY(0);
    box-shadow: var(--shadow-base);
  }
  to {
    transform: translateY(-5px);
    box-shadow: var(--shadow-base-hover);
  }
}
</style>
