import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick, ref } from 'vue'
import { useMoviesSearcher } from '../../src/composables/useMoviesSearcher'

// --- MOCK INTERSECTION OBSERVER ---
class IntersectionObserverMock {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
}
global.IntersectionObserver = IntersectionObserverMock as any

// --- MOCK fetch ---
global.fetch = vi.fn(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve({
                results: [
                    { imdbID: '1', Title: 'Test Movie', Year: '2023', Poster: 'url', validPoster: true }
                ],
                totalResults: 1
            })
    })
) as any

describe('useMoviesSearcher', () => {
    let movies: ReturnType<typeof useMoviesSearcher>

    beforeEach(() => {
        sessionStorage.clear()
        movies = useMoviesSearcher()
    })

    it('initial values are correct', () => {
        expect(movies.query.value).toBe('')
        expect(movies.results.value).toEqual([])
        expect(movies.recent_searches.value).toEqual([])
        expect(movies.loading.value).toBe(false)
        expect(movies.lazyMode.value).toBe(false)
        expect(movies.page.value).toBe(1)
    })

    it('search updates results and recent_searches', async () => {
        movies.query.value = 'Test'
        await movies.search()
        expect(movies.results.value.length).toBe(1)
        expect(movies.recent_searches.value[0]).toBe('Test')
    })

    it('toggleMode switches lazyMode and calls fetchPage', async () => {
        const initialMode = movies.lazyMode.value
        await movies.toggleMode()
        expect(movies.lazyMode.value).toBe(!initialMode)
        expect(movies.results.value.length).toBe(1) // fetchPage pushes results
    })

    it('prevPage decrements page and fetches', async () => {
        movies.page.value = 2
        await movies.prevPage()
        expect(movies.page.value).toBe(1)
    })

    it('goToPage changes to valid page', async () => {
        await movies.search()
        await movies.goToPage(1)
        expect(movies.page.value).toBe(1)
    })

    it('handleBrokenImage marks poster invalid', () => {
        const movie = { imdbID: '1', Title: 'T', Year: '2023', Poster: 'url', validPoster: true }
        const mockEvent = { target: { style: { display: '' } } } as unknown as Event
        movies.handleBrokenImage(mockEvent, movie)
        expect(movie.validPoster).toBe(false)
    })

    it('removeRecent removes item from recent_searches', () => {
        movies.recent_searches.value = ['A', 'B']
        movies.removeRecent(0)
        expect(movies.recent_searches.value).toEqual(['B'])
    })
})
