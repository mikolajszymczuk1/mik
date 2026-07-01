<template>
  <BaseDialog v-model="isOpen" :close-on-backdrop="closeOnBackdrop" @close="emit('close')">
    <div class="flex flex-col items-center gap-6">
      <div class="flex flex-col items-center gap-2">
        <FontAwesomeIcon :icon="faGem" class="text-game-accent text-[64px]" />
        <BaseText text="Perfect!" size="x-large" />
        <BaseText :text="formattedTime(elapsedSeconds)" size="large" />
      </div>
      <BaseActionButton class="w-full" label="Next Level" @click="emit('close')" />
    </div>
  </BaseDialog>
</template>

<script lang="ts" setup>
import BaseDialog from '@shared/presentation/ui/base/dialogs/BaseDialog.vue'
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGem } from '@fortawesome/free-solid-svg-icons'
import BaseActionButton from '@shared/presentation/ui/base/buttons/BaseActionButton.vue'
import BaseText from '@shared/presentation/ui/base/text/BaseText.vue'
import { formattedTime } from '@shared/application/helpers/formattedTime.helper'

interface Props {
  modelValue: boolean
  closeOnBackdrop?: boolean
  elapsedSeconds: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  closeOnBackdrop: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const isOpen = computed<boolean>({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})
</script>
