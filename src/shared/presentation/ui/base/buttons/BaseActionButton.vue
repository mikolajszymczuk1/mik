<template>
  <button
    class="bg-game-cell-background border-game-cell-border shadow-base hover:shadow-base-hover active:shadow-base-active flex h-12 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-150 ease-out hover:-translate-y-1.25 active:translate-y-0.5"
    :class="!label ? 'w-12' : 'px-4'"
    @click="emit('click')"
  >
    <FontAwesomeIcon v-if="icon" :icon="icon" class="text-game-accent text-2xl" />
    <BaseText :text="label" />
  </button>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { type IconDefinition } from '@fortawesome/free-solid-svg-icons'
import BaseText from '@shared/presentation/ui/base/text/BaseText.vue'

interface Props {
  label?: string
  icon?: IconDefinition
}

defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()
</script>
