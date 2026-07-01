<template>
  <MikGameView />
</template>

<script setup lang="ts">
import MikGameView from '@game/presentation/views/MikGameView.vue'
import { useThemeSettings } from '@shared/application/theme/useThemeSettings'

const { initializeThemeSettings } = useThemeSettings()

initializeThemeSettings()
</script>
