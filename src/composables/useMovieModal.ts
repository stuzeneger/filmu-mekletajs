import { ref } from 'vue'
import type { Movie } from '@/types/movie'
export function useMovieModal() {

    const movie = ref<Movie | null>(null)
    const error = ref<string | null>(null)

    async function viewMovie(id: string) {
        error.value = null
        try {
            const res = await fetch(`/api/movie.php?id=${id}`)
            const data = await res.json()
            if (data.movie) {
                data.movie.validPoster = !!data.movie.Poster && data.movie.Poster !== 'N/A'
                movie.value = data.movie
            } else {
                error.value = data.error || 'Nezināma kļūda'
            }
        } catch (e: any) {
            error.value = e.message
        }
    }

    function closeModal() {
        movie.value = null
    }

    return {
        movie,
        error,
        viewMovie,
        closeModal
    }
}
