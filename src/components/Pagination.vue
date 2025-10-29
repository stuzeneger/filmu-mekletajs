<template>
  <div class="pagination">
    <button @click="$emit('prev-page')" :disabled="page <= 1">« Iepriekšējā</button>
    <template v-for="p in pageList" :key="p">
      <button
          v-if="p !== '...'"
          @click="$emit('go-to-page', p)"
          :class="{ active: p === page }"
      >
        {{ p }}
      </button>
      <span v-else class="ellipsis">…</span>
    </template>
    <button @click="$emit('next-page')" :disabled="page >= totalPages">Nākamā »</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'Pagination',
  props: {
    page: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    maxVisiblePages: {
      type: Number,
      default: 5
    }
  },
  emits: ['prev-page', 'next-page', 'go-to-page'],
  setup(props) {
    const pageList = computed(() => {
      const pages: (number | string)[] = []
      const half = Math.floor(props.maxVisiblePages / 2)

      let start = Math.max(1, props.page - half)
      let end = Math.min(props.totalPages, start + props.maxVisiblePages - 1)

      // Adjust start if we're near the end
      if (end - start + 1 < props.maxVisiblePages) {
        start = Math.max(1, end - props.maxVisiblePages + 1)
      }

      if (start > 1) {
        pages.push(1)
        if (start > 2) {
          pages.push('...')
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (end < props.totalPages) {
        if (end < props.totalPages - 1) {
          pages.push('...')
        }
        pages.push(props.totalPages)
      }

      return pages
    })

    return {
      pageList
    }
  }
})
</script>

<style lang="scss" scoped>
@use "@/assets/styles/pagination.scss" as *;
</style>