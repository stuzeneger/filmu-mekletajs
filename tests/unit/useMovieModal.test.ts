import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useMovieModal } from '@/composables/useMovieModal'

describe('useMovieModal', () => {
    let originalFetch: any

    beforeEach(() => {
        originalFetch = global.fetch
        global.fetch = vi.fn()
    })

    afterEach(() => {
        global.fetch = originalFetch
    })

    it('initial values are correct', () => {
        const modal = useMovieModal()
        expect(modal.movie.value).toBeNull()
        expect(modal.error.value).toBeNull()
    })

    it('viewMovie sets movie when fetch returns data', async () => {
        const mockMovie = { imdbID: '1', Title: 'Test Movie', Year: '2023', Poster: 'url' }
        ;(global.fetch as any).mockResolvedValue({
            json: async () => ({ movie: mockMovie })
        })

        const modal = useMovieModal()
        await modal.viewMovie('1')

        expect(modal.movie.value).toEqual({ ...mockMovie, validPoster: true })
        expect(modal.error.value).toBeNull()
    })

    it('viewMovie sets error when fetch returns error', async () => {
        ;(global.fetch as any).mockResolvedValue({
            json: async () => ({ error: 'Not found' })
        })

        const modal = useMovieModal()
        await modal.viewMovie('2')

        expect(modal.movie.value).toBeNull()
        expect(modal.error.value).toBe('Not found')
    })

    it('viewMovie sets error when fetch throws', async () => {
        ;(global.fetch as any).mockRejectedValue(new Error('Network error'))

        const modal = useMovieModal()
        await modal.viewMovie('3')

        expect(modal.movie.value).toBeNull()
        expect(modal.error.value).toBe('Network error')
    })

    it('closeModal resets movie', async () => {
        const modal = useMovieModal()
        modal.movie.value = { imdbID: '1', Title: 'Movie', Year: '2023', Poster: 'url' }
        modal.closeModal()
        expect(modal.movie.value).toBeNull()
    })
})
