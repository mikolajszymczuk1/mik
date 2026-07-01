<template>
  <Teleport to="body">
    <Transition name="dialog-backdrop">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm"
        @click.self="handleBackdropClick"
      >
        <Transition appear name="dialog-panel">
          <div
            class="bg-game-cell-background border-game-cell-border max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-auto rounded-3xl border-2 p-12"
            role="dialog"
            aria-modal="true"
          >
            <slot />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { onUnmounted, watch } from 'vue'

interface Props {
  modelValue: boolean
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  closeOnBackdrop: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const closeDialog = (): void => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = (): void => {
  if (!props.closeOnBackdrop) return

  closeDialog()
}

watch(
  () => props.modelValue,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
  { immediate: true },
)

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.dialog-backdrop-enter-active,
.dialog-backdrop-leave-active {
  transition:
    opacity 180ms ease,
    backdrop-filter 180ms ease;
}

.dialog-backdrop-enter-from,
.dialog-backdrop-leave-to {
  opacity: 0;
  backdrop-filter: blur(0);
}

.dialog-panel-enter-active {
  transition:
    opacity 220ms ease,
    transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
}

.dialog-panel-leave-active {
  transition:
    opacity 140ms ease,
    transform 140ms ease;
}

.dialog-panel-enter-from,
.dialog-panel-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}
</style>
