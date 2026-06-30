<template>
  <div
    class="bg-game-window-background relative grid h-100 w-100 grid-cols-5 grid-rows-5 gap-3 rounded-3xl p-4"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <GameCellUi v-for="cell in cells" :key="cell.id" :cell="cell" @cell-down="onCellDown" />
    <PathOverlayUi :positions="path" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import type Cell from '@game/domain/models/Cell'
import GameCellUi from '@game/presentation/widgets/GameCell/GameCell.ui.vue'
import PathOverlayUi from '@game/presentation/widgets/PathOverlay/PathOverlay.ui.vue'
import type { Position } from '@game/domain/types/Position.type'

interface Props {
  cells: Cell[]
  path: Position[]
}

defineProps<Props>()

const emit = defineEmits<{
  'drag-start': [position: Position]
  'drag-enter': [position: Position]
  'drag-end': []
}>()

const dragging = ref(false)
const lastEntered = ref<Position | null>(null)

const onCellDown = (position: Position): void => {
  dragging.value = true
  lastEntered.value = position
  emit('drag-start', position)
}

const onPointerMove = (e: PointerEvent): void => {
  if (!dragging.value) return
  const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
  if (!el) return
  const x = el.dataset.x
  const y = el.dataset.y
  if (x === undefined || y === undefined) return
  const pos: Position = { x: Number(x), y: Number(y) }
  if (pos.x === lastEntered.value?.x && pos.y === lastEntered.value?.y) return
  lastEntered.value = pos
  emit('drag-enter', pos)
}

const onPointerUp = (): void => {
  if (dragging.value) {
    dragging.value = false
    lastEntered.value = null
    emit('drag-end')
  }
}

onMounted((): void => {
  document.addEventListener('pointerup', onPointerUp)
  document.addEventListener('pointermove', onPointerMove)
})

onUnmounted((): void => {
  document.removeEventListener('pointerup', onPointerUp)
  document.removeEventListener('pointermove', onPointerMove)
})
</script>
