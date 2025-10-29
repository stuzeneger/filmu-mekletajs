<template>
  <div
      class="card"
      @click="handleClick"
      :class="{ loaded: !loading }"
  >
    <div class="poster-wrapper">
      <img
          v-if="movieItem.validPoster"
          :src="movieItem.Poster"
          :alt="movieItem.Title"
          @error="handleBrokenImage"
      />
    </div>
    <div class="card-title">{{ movieItem.Title }}</div>
    <div class="card-year">{{ movieItem.Year }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export interface MovieItem {
  imdbID: string
  Title: string
  Year: string
  Poster: string
  validPoster?: boolean
}

export default defineComponent({
  name: 'MovieCard',
  props: {
    movieItem: {
      type: Object as PropType<MovieItem>,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['view-movie', 'broken-image'],
  setup(props, { emit }) {
    const handleClick = () => {
      emit('view-movie', props.movieItem.imdbID)
    }

    const handleBrokenImage = (event: Event) => {
      emit('broken-image', event, props.movieItem)
    }

    return {
      handleClick,
      handleBrokenImage
    }
  }
})
</script>

<style lang="scss" scoped>
@use "@/assets/styles/movie_card.scss" as *;
</style>