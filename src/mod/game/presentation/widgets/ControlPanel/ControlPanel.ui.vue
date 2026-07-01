<template>
  <div class="flex items-center justify-between">
    <slot name="timer" />
    <div class="flex items-center gap-2">
      <BaseActionButton :icon="faSun" @click="changeLightDarkMode" />
      <BaseActionButton :icon="faCircle" @click="changeAccentTheme" />
      <BaseActionButton :icon="faArrowRotateRight" @click="repeat" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import BaseActionButton from '@/shared/presentation/ui/base/buttons/BaseActionButton.vue'
import { faSun, faArrowRotateRight, faCircle } from '@fortawesome/free-solid-svg-icons'

const emit = defineEmits<{
  'action-change-light-dark-mode': []
  'action-change-accent-theme': []
  'action-repeat': []
}>()

const changeLightDarkMode = (): void => {
  emit('action-change-light-dark-mode')
}

const changeAccentTheme = (): void => {
  emit('action-change-accent-theme')
}

const repeat = (): void => {
  emit('action-repeat')
}
</script>
