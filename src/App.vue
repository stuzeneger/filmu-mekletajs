<template>
  <div id="app">
    <h1>Filmu meklētājs</h1>

    <div class="top-bar">
      <input v-model="query" type="text" placeholder="Meklēt filmu..."/>
      <button
          class="search-btn"
          :disabled="!validator.isValid(query) || loading"
          @click="search"
      >
        Meklēt
      </button>
      <ListSwitcherButton
          :isOn="lazyMode"
          @toggle="toggleMode"
      />
    </div>

    <div class="content-wrapper">

      <div v-if="recent_searches.length" class="recent-searches">
        <h3>Pēdējie meklējumi:</h3>
        <ul>
          <li v-for="(term, idx) in recent_searches" :key="term">
            <a @click.prevent="query = term; page = 1; search()">{{ term }}</a>
            <a class="delete-btn" @click.prevent="removeRecent(idx)">×</a>
          </li>
        </ul>
      </div>

      <p v-if="results.length && !loading">
        Kopā atrastas {{ totalResults }} filmas:
        <span v-if="!lazyMode">(rādu ierakstus no {{ start }} līdz {{ end }})</span>
      </p>

      <Spinner v-if="loading && !lazyMode"/>

      <div class="cards">
        <MovieCard
            v-for="movieItem in results"
            :key="movieItem.imdbID"
            :movie-item="movieItem"
            @view-movie="viewMovie"
            @broken-image="handleBrokenImage"
        />

        <!-- Spinner zem kartiņām lazy load režīmā -->
        <div v-if="loading && lazyMode" class="lazy-spinner">
          <Spinner/>
        </div>
      </div>

      <!-- Lappuses - izmantojam jauno komponenti -->
      <Pagination
          v-if="!lazyMode && totalPages > 0"
          :page="page"
          :total-pages="totalPages"
          @prev-page="prevPage"
          @next-page="nextPage"
          @go-to-page="goToPage"
      />
    </div>

    <MovieInfoPopup
        :movie="movie"
        :is-open="!!movie"
        :error="error"
        @close="closeModal"
    />
  </div>
</template>

<script lang="ts">
import {onMounted} from 'vue'
import {useMoviesSearcher} from './composables/useMoviesSearcher'
import {useMovieModal} from './composables/useMovieModal'
import {useLazyLoad} from './composables/useLazyLoad'
import MovieInfoPopup from "@/components/MovieInfoPopup.vue"
import Pagination from "@/components/Pagination.vue"
import MovieCard from "@/components/MovieCard.vue"
import Spinner from "@/components/Spinner.vue";
import ListSwitcherButton from "@/components/ListSwitcherButton.vue";
import { SearchValidator } from '@/validators/SearchValidator';

export default {
  components: {
    ListSwitcherButton,
    Spinner,
    MovieInfoPopup,
    Pagination,
    MovieCard
  },
  setup() {
    const movies = useMoviesSearcher()
    const movieInfoPopup = useMovieModal()
    const validator = new SearchValidator() // <--- Validator instance

    useLazyLoad(
        movies.search,
        movies.loading,
        movies.page,
        movies.totalPages
    )

    onMounted(() => {
      if (movies.recent_searches.value.length) movies.search(false)
    })

    return {
      ...movies,
      ...movieInfoPopup,
      validator
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/styles/main.scss";
</style>
