<template>
  <div
    class="bg-game-cell-background border-game-cell-border shadow-base flex h-12 min-w-25 items-center justify-center rounded-full border-2 px-4"
  >
    <BaseText :text="formattedTime" />
  </div>
</template>

<script lang="ts" setup>
import BaseText from '@/shared/presentation/ui/base/text/BaseText.vue'
import { computed, onUnmounted, watch } from 'vue'

interface Props {
  elapsedSeconds: number
  isRunning: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'action-tick': []
}>()

let intervalId: ReturnType<typeof setInterval> | undefined

const formattedTime = computed<string>(() => {
  const minutes = Math.floor(props.elapsedSeconds / 60)
  const seconds = props.elapsedSeconds % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
})

const stopTimer = (): void => {
  if (!intervalId) return

  clearInterval(intervalId)
  intervalId = undefined
}

const startTimer = (): void => {
  if (intervalId) return

  intervalId = setInterval(() => {
    emit('action-tick')
  }, 1000)
}

watch(
  () => props.isRunning,
  (isRunning) => {
    if (isRunning) {
      startTimer()
      return
    }

    stopTimer()
  },
  { immediate: true },
)

onUnmounted(stopTimer)
</script>
