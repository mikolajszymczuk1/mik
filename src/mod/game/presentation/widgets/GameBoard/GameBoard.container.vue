<template>
  <GameBoardUi
    :cells="cells"
    @drag-start="handleDragStart"
    @drag-enter="handleDragEnter"
    @drag-end="handleDragEnd"
  />
</template>

<script lang="ts" setup>
import GameBoardUi from '@game/presentation/widgets/GameBoard/GameBoard.ui.vue'
import Cell from '@game/domain/models/Cell'
import { onBeforeMount, type Ref, ref, watch } from 'vue'
import type { Position } from '@game/domain/types/Position.type'

const BOARD_SIZE = 5

const cells: Ref<Cell[]> = ref([])
const activeCellsPositions: Ref<Position[]> = ref([])

const createCells = (): void => {
  let col = 0
  let row = 0

  for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
    if (col === BOARD_SIZE) {
      col = 0
      row++
    }

    const cell = new Cell(col, row)
    cells.value.push(cell)
    col++
  }
}

const activateCell = (position: Position): void => {
  cells.value.find((cell) => cell.x === position.x && cell.y === position.y)!.active = true
}

const deactivateCell = (position: Position): void => {
  cells.value.find((cell) => cell.x === position.x && cell.y === position.y)!.active = false
}

const handleDragStart = (position: Position): void => {
  if (activeCellsPositions.value.length !== 0) {
    const lastPosition = activeCellsPositions.value[activeCellsPositions.value.length - 1]!
    if (position.x === lastPosition.x && position.y === lastPosition.y) return
    activeCellsPositions.value.forEach(deactivateCell)
  }

  activateCell(position)
  activeCellsPositions.value = [position]
}

const handleDragEnter = (position: Position): void => {
  if (activeCellsPositions.value.length < 1) return

  const lastCellPosition = activeCellsPositions.value[activeCellsPositions.value.length - 1]!

  const dx = position.x - lastCellPosition.x
  const dy = position.y - lastCellPosition.y
  if (Math.abs(dx) + Math.abs(dy) !== 1) return

  const existingIndex = activeCellsPositions.value.findIndex(
    (p) => p.x === position.x && p.y === position.y,
  )

  if (existingIndex === -1) {
    activateCell(position)
    activeCellsPositions.value.push(position)
  } else {
    const removed = activeCellsPositions.value.splice(existingIndex + 1)
    removed.forEach(deactivateCell)
  }
}

const handleDragEnd = (): void => {
  console.log('end')
}

watch(
  activeCellsPositions,
  (positions: Position[]) => {
    console.log(positions.map((p) => `(${p.x},${p.y})`).join(' -> '))
  },
  { deep: true },
)

onBeforeMount((): void => {
  createCells()
})
</script>
