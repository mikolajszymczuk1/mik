<template>
  <svg
    class="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      v-for="segment in completedSegments"
      :key="segment.key"
      :x1="segment.x1"
      :y1="segment.y1"
      :x2="segment.x2"
      :y2="segment.y2"
      class="path-line"
    />
    <line
      v-if="activeSegment"
      :x1="activeSegment.x1"
      :y1="activeSegment.y1"
      :x2="activeSegment.x2"
      :y2="activeSegment.y2"
      :style="{ strokeDashoffset: activeSegmentOffset }"
      class="path-line path-line--active"
    />
    <circle v-if="positions.length > 0" :cx="dotX" :cy="dotY" r="16" class="path-dot" />
    <circle v-if="positions.length > 0" :cx="dotX" :cy="dotY" r="6" class="path-dot-inner" />
  </svg>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import type { Position } from '@game/domain/types/Position.type'

interface Segment {
  key: string
  x1: number
  y1: number
  x2: number
  y2: number
}

interface Props {
  positions: Position[]
}

const props = defineProps<Props>()

const CELL_SIZE = 64
const GAP = 12
const PADDING = 16
const STEP = CELL_SIZE + GAP
const DURATION = 280

const dotX = ref(0)
const dotY = ref(0)
const segmentProgress = ref(1)
const isAddingSegment = ref(false)

let rafId: number | null = null
let animStart = 0
let fromX = 0,
  fromY = 0,
  toX = 0,
  toY = 0
let prevRef: Position[] | null = null
let prevLen = 0

const completedSegments = computed<Segment[]>(() => {
  const len = props.positions.length
  const upTo = isAddingSegment.value ? len - 2 : len - 1
  const result: Segment[] = []
  for (let i = 0; i < upTo; i++) {
    const a = cellCenter(props.positions[i]!)
    const b = cellCenter(props.positions[i + 1]!)
    result.push({
      key: `${props.positions[i]!.x},${props.positions[i]!.y}-${props.positions[i + 1]!.x},${props.positions[i + 1]!.y}`,
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
    })
  }
  return result
})

const activeSegment = computed<Segment | null>(() => {
  const len = props.positions.length
  if (!isAddingSegment.value || len < 2) return null
  const a = cellCenter(props.positions[len - 2]!)
  const b = cellCenter(props.positions[len - 1]!)
  return { key: 'active', x1: a.x, y1: a.y, x2: b.x, y2: b.y }
})

const activeSegmentOffset = computed(() => STEP * (1 - segmentProgress.value))

const cellCenter = (pos: Position): { x: number; y: number } => ({
  x: PADDING + pos.x * STEP + CELL_SIZE / 2,
  y: PADDING + pos.y * STEP + CELL_SIZE / 2,
})

const easeOutBack = (t: number): number => {
  const c1 = 1.2
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

const tick = (now: number): void => {
  const raw = Math.min((now - animStart) / DURATION, 1)
  const p = easeOutBack(raw)
  segmentProgress.value = p
  dotX.value = fromX + (toX - fromX) * p
  dotY.value = fromY + (toY - fromY) * p
  if (raw < 1) {
    rafId = requestAnimationFrame(tick)
  } else {
    rafId = null
    isAddingSegment.value = false
  }
}

const snapAndCancel = (): void => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
    dotX.value = toX
    dotY.value = toY
    segmentProgress.value = 1
    isAddingSegment.value = false
  }
}

const startAnim = (to: { x: number; y: number }, adding: boolean): void => {
  fromX = dotX.value
  fromY = dotY.value
  toX = to.x
  toY = to.y
  animStart = performance.now()
  segmentProgress.value = 0
  isAddingSegment.value = adding
  rafId = requestAnimationFrame(tick)
}

watch(
  () => props.positions,
  (curr) => {
    const isReplaced = curr !== prevRef
    prevRef = curr
    const newLen = curr.length
    const oldLen = prevLen
    prevLen = newLen

    if (newLen === 0) {
      snapAndCancel()
      return
    }

    const newEnd = cellCenter(curr[newLen - 1]!)

    if (oldLen === 0 && newLen === 1) {
      snapAndCancel()
      dotX.value = newEnd.x
      dotY.value = newEnd.y
      return
    }

    if (isReplaced && newLen === 1) {
      snapAndCancel()
      startAnim(newEnd, false)
      return
    }

    if (newLen > oldLen) {
      snapAndCancel()
      startAnim(newEnd, true)
    } else {
      snapAndCancel()
      startAnim(newEnd, false)
    }
  },
  { deep: true },
)

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.path-line {
  stroke: var(--color-game-accent);
  stroke-width: 18;
  stroke-linecap: round;
}

.path-line--active {
  stroke-dasharray: 76;
}

.path-dot {
  fill: var(--color-game-accent);
}

.path-dot-inner {
  fill: white;
}
</style>
