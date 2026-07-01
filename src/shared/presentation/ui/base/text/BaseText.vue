<template>
  <span class="text-text-primary font-rubik font-semibold" :class="[textSize]">
    {{ text }}
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  text?: string
  size?: 'small' | 'medium' | 'large' | 'x-large'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
})

const textSize = computed<string>(() => {
  switch (props.size) {
    case 'small':
      return 'text-[12px]'
    case 'medium':
      return 'text-[14px]'
    case 'large':
      return 'text-[16px]'
    case 'x-large':
      return 'text-[32px]'
    default:
      return 'text-[14px]'
  }
})
</script>
