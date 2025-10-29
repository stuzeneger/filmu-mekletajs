<template>
  <div class="toggle-switch" @click="$emit('toggle')">
    <div :class="['switch', isOn ? 'on' : 'off']"></div>
    <span class="switch-label">{{ isOn ? onLabel : offLabel }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ListSwitcherButton',
  props: {
    isOn: {
      type: Boolean,
      required: true
    },
    onLabel: {
      type: String,
      default: 'Dalīts pa lapām'
    },
    offLabel: {
      type: String,
      default: 'Lēnā ielāde'
    }
  }
})
</script>

<style lang="scss" scoped>
@use "@/assets/styles/list_switcher_button.scss" as *;
</style>
