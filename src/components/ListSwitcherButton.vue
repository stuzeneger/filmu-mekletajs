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
.toggle-switch {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;

  .switch {
    width: 40px;
    height: 20px;
    border-radius: 10px;
    margin-right: 8px;
    background-color: #ccc;
    position: relative;
    transition: background-color 0.3s;

    &.on {
      background-color: #4caf50;
    }

    &::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: white;
      transition: transform 0.3s;
    }

    &.on::after {
      transform: translateX(20px);
    }
  }

  .switch-label {
    font-weight: 500;
    color: #333;
  }
}
</style>
