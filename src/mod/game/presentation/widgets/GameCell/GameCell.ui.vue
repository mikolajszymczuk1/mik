<template>
  <div
    class="bg-game-cell-background shadow-game-cell hover:shadow-game-cell-hover active:shadow-game-cell-active h-16 w-16 cursor-pointer rounded-xl border-2 transition-all duration-150 ease-out hover:-translate-y-1.25 active:translate-y-0.5"
    :class="cell.active ? 'border-game-accent' : 'border-game-cell-border'"
    :data-x="cell.x"
    :data-y="cell.y"
    style="touch-action: none"
    @pointerdown.prevent="emit('cell-down', position)"
  ></div>
</template>

<script lang="ts" setup>
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
