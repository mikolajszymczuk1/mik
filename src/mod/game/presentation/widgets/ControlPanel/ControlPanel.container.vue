<template>
  <ControlPanelUi
    @action-change-light-dark-mode="handleChangeLightDarkMode"
    @action-change-accent-theme="handleChangeAccentTheme"
    @action-repeat="handleRepeat"
  />
</template>

<script lang="ts" setup>
import ControlPanelUi from '@game/presentation/widgets/ControlPanel/ControlPanel.ui.vue'
import { useResetGameCommandAction } from '@game/application/commands/resetGameCommandAction'
import { useThemeSettings } from '@shared/application/theme/useThemeSettings'

const { resetGameAction } = useResetGameCommandAction()
const { toggleThemeMode, changeAccentColor } = useThemeSettings()

const handleChangeLightDarkMode = (): void => {
  toggleThemeMode()
}

const handleChangeAccentTheme = (): void => {
  changeAccentColor()
}

const handleRepeat = (): void => {
  resetGameAction()
}
</script>
