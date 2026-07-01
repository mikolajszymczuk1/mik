<template>
  <div
    ref="boardElement"
    class="bg-game-window-background relative grid aspect-square w-[min(25rem,calc(100vw-2rem))] touch-none grid-cols-5 grid-rows-5 gap-[clamp(0.5rem,2.8vw,0.75rem)] rounded-3xl p-[clamp(0.75rem,3.5vw,1rem)] select-none"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <GameCellUi v-for="cell in cells" :key="cell.id" :cell="cell" @cell-down="onCellDown" />
    <PathOverlayUi :metrics="boardMetrics" :positions="path" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import type Cell from '@game/domain/models/Cell'
import GameCellUi from '@game/presentation/widgets/GameCell/GameCell.ui.vue'
import PathOverlayUi from '@game/presentation/widgets/PathOverlay/PathOverlay.ui.vue'
import type { Position } from '@game/domain/types/Position.type'

const BOARD_SIZE = 5

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
const boardElement = ref<HTMLElement | null>(null)
const boardMetrics = reactive({
  cellSize: 64,
  gap: 12,
  padding: 16,
  step: 76,
})

let resizeObserver: ResizeObserver | undefined

const updateBoardMetrics = (): void => {
  if (!boardElement.value) return

  const styles = getComputedStyle(boardElement.value)
  const boardWidth = boardElement.value.getBoundingClientRect().width
  const padding = parseFloat(styles.paddingLeft)
  const gap = parseFloat(styles.columnGap)
  const cellSize = (boardWidth - padding * 2 - gap * (BOARD_SIZE - 1)) / BOARD_SIZE

  boardMetrics.padding = padding
  boardMetrics.gap = gap
  boardMetrics.cellSize = cellSize
  boardMetrics.step = cellSize + gap
}

const onCellDown = (position: Position): void => {
  dragging.value = true
  lastEntered.value = position
  emit('drag-start', position)
}

const onPointerMove = (e: PointerEvent): void => {
  if (!dragging.value) return
  e.preventDefault()

  const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
  if (!el) return
  const cellElement = el.closest<HTMLElement>('[data-x][data-y]')
  if (!cellElement) return
  const x = cellElement.dataset.x
  const y = cellElement.dataset.y
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
  updateBoardMetrics()
  if (boardElement.value) {
    resizeObserver = new ResizeObserver(updateBoardMetrics)
    resizeObserver.observe(boardElement.value)
  }

  document.addEventListener('pointerup', onPointerUp)
  document.addEventListener('pointermove', onPointerMove, { passive: false })
})

onUnmounted((): void => {
  resizeObserver?.disconnect()
  document.removeEventListener('pointerup', onPointerUp)
  document.removeEventListener('pointermove', onPointerMove)
})
</script>
