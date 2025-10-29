<template>
  <div :class="['modal-overlay', { show: isOpen }]" @click.self="closeModal">
    <div class="modal-content">
      <span class="modal-close" @click="closeModal">&times;</span>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <template v-else-if="movie">
        <img
            v-if="movie.validPoster"
            :src="movie.Poster"
            :alt="movie.Title"
        />
        <h3>{{ movie.Title }} ({{ movie.Year }})</h3>
        <p><strong>Žanrs:</strong> {{ movie.Genre || 'Nav norādīts' }}</p>
        <p><strong>Režisors:</strong> {{ movie.Director || 'Nav norādīts' }}</p>
        <p><strong>Aktieri:</strong> {{ movie.Actors || 'Nav norādīts' }}</p>
        <p><strong>Apraksts:</strong> {{ movie.Plot || 'Nav apraksta' }}</p>
        <p><strong>IMDB vērtējums:</strong> {{ movie.imdbRating || 'Nav vērtējuma' }}</p>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'

export interface Movie {
  imdbID: string
  Title: string
  Year: string
  Poster?: string
  validPoster?: boolean
  Genre?: string
  Director?: string
  Actors?: string
  Plot?: string
  imdbRating?: string
}

export default defineComponent({
  name: 'MovieInfoPopup',
  props: {
    movie: {
      type: Object as PropType<Movie | null>,
      default: null
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    error: {
      type: String as PropType<string | null>,
      default: null
    }
  },
  emits: ['close'],
  setup(props, {emit}) {
    const closeModal = () => {
      emit('close')
    }

    return {
      closeModal
    }
  }
})
</script>

<style lang="scss" scoped>
@use "@/assets/styles/info_popup.scss" as *;
</style>
