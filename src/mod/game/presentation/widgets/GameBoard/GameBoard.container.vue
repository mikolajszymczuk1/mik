<template>
  <GameBoardUi
    :cells="cells"
    :path="activeCellsPositions"
    @drag-start="handleDragStart"
    @drag-enter="handleDragEnter"
    @drag-end="handleDragEnd"
  />
</template>

<script lang="ts" setup>
import GameBoardUi from '@game/presentation/widgets/GameBoard/GameBoard.ui.vue'
import Cell from '@game/domain/models/Cell'
import { onBeforeMount, onMounted, type Ref, ref } from 'vue'
import type { Position } from '@game/domain/types/Position.type'
import { useStartGameCommandAction } from '@game/application/commands/startGameCommandAction'
import { useFinishLevelCommandAction } from '@game/application/commands/finishLevelCommandAction'

const BOARD_SIZE = 5

const cells: Ref<Cell[]> = ref([])
const activeCellsPositions: Ref<Position[]> = ref([])
const landPositions: Ref<Position[]> = ref([])

const { startGameAction } = useStartGameCommandAction()
const { finishLevelAction } = useFinishLevelCommandAction()

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

const generateRandomPath = (): Position[] => {
  const visited = new Set<string>()
  const path: Position[] = []

  const key = (p: Position) => `${p.x},${p.y}`

  const neighbors = (p: Position): Position[] =>
    [
      { x: p.x, y: p.y - 1 },
      { x: p.x, y: p.y + 1 },
      { x: p.x - 1, y: p.y },
      { x: p.x + 1, y: p.y },
    ].filter((n) => n.x >= 0 && n.x < BOARD_SIZE && n.y >= 0 && n.y < BOARD_SIZE)

  const shuffle = <T,>(arr: T[]): T[] => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
    }
    return arr
  }

  const unvisited = (p: Position) => neighbors(p).filter((n) => !visited.has(key(n)))

  let current: Position = {
    x: Math.floor(Math.random() * BOARD_SIZE),
    y: Math.floor(Math.random() * BOARD_SIZE),
  }

  visited.add(key(current))
  path.push(current)

  while (path.length < BOARD_SIZE * BOARD_SIZE) {
    const candidates = shuffle(unvisited(current))
    if (candidates.length === 0) return generateRandomPath()
    candidates.sort((a, b) => unvisited(a).length - unvisited(b).length)
    current = candidates[0]!
    visited.add(key(current))
    path.push(current)
  }

  return path
}

const prepareNewLevel = () => {
  const path = generateRandomPath()
  // Uncomment these lines for level path preview
  // path.forEach(activateCell)
  // activeCellsPositions.value = path

  const middle = path.slice(1, -1)
  for (let i = middle.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[middle[i], middle[j]] = [middle[j]!, middle[i]!]
  }
  const picks = [
    path[0]!,
    ...middle.slice(0, 3).sort((a, b) => path.indexOf(a) - path.indexOf(b)),
    path[path.length - 1]!,
  ]
  landPositions.value = picks
  picks.forEach((position, index) => setLandNumber(position, index + 1))
}

const getCellAt = (position: Position) =>
  cells.value.find((cell) => cell.x === position.x && cell.y === position.y)!

const activateCell = (position: Position): void => {
  getCellAt(position).active = true
}

const deactivateCell = (position: Position): void => {
  getCellAt(position).active = false
}

const setLandNumber = (position: Position, number: number): void => {
  getCellAt(position).landNumber = number
}

const handleDragStart = (position: Position): void => {
  if (activeCellsPositions.value.length !== 0) return
  if (!landPositions.value[0]) return
  if (position.x !== landPositions.value[0]!.x || position.y !== landPositions.value[0]!.y) return

  startGameAction()
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
    const targetLandNumber = getCellAt(position).landNumber
    if (targetLandNumber !== -1) {
      const visitedLands = activeCellsPositions.value.filter(
        (p) => getCellAt(p).landNumber !== -1,
      ).length
      if (targetLandNumber !== visitedLands + 1) return
      const isLastLand = targetLandNumber === landPositions.value.length
      if (isLastLand && activeCellsPositions.value.length !== BOARD_SIZE * BOARD_SIZE - 1) return
    }
    activateCell(position)
    activeCellsPositions.value.push(position)

    if (activeCellsPositions.value.length === BOARD_SIZE * BOARD_SIZE) {
      finishLevelAction()
    }
  } else {
    const removed = activeCellsPositions.value.splice(existingIndex + 1)
    removed.forEach(deactivateCell)
  }
}

const handleDragEnd = (): void => {
  // Some action on drag end event
}

onBeforeMount((): void => {
  createCells()
})

onMounted(() => {
  prepareNewLevel()
})
</script>
