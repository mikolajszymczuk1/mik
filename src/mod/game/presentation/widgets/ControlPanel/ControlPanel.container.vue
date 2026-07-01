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

const { resetGameAction } = useResetGameCommandAction()

const handleChangeLightDarkMode = (): void => {}

const handleChangeAccentTheme = (): void => {}

const handleRepeat = (): void => {
  resetGameAction()
}
</script>
