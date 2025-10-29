import { ref, computed, nextTick, type Ref } from 'vue'
import type { Movie } from '@/types/movie'
import { useLazyLoad } from '@/composables/useLazyLoad'

export function useMoviesSearcher() {
    const query = ref('')
    const results = ref<Movie[]>([]) as Ref<Movie[]>
    const recent_searches = ref<string[]>(JSON.parse(sessionStorage.getItem('recent_searches') || '[]'))
    const totalResults = ref(0)
    const totalPages = ref(0)
    const page = ref(1)
    const RESULTS_PER_PAGE = 10
    const start = ref(0)
    const end = ref(0)
    const pageRange = 2
    const loading = ref(false)
    const lazyMode = ref(false)

    const pageList = computed(() => {
        const pages: (number | string)[] = []
        if (totalPages.value <= 7) {
            for (let i = 1; i <= totalPages.value; i++) pages.push(i)
        } else {
            pages.push(1)
            const left = Math.max(page.value - pageRange, 2)
            const right = Math.min(page.value + pageRange, totalPages.value - 1)
            if (left > 2) pages.push('...')
            for (let i = left; i <= right; i++) pages.push(i)
            if (right < totalPages.value - 1) pages.push('...')
            pages.push(totalPages.value)
        }
        return pages
    })

    const { initObserver, disconnectObserver } = useLazyLoad(fetchPage, loading, page, totalPages)

    async function fetchPage() {
        loading.value = true
        try {
            const res = await fetch(`/api/search.php?q=${encodeURIComponent(query.value)}&page=${page.value}`)
            const data = await res.json()

            if (data.error) {
                console.error('API error:', data.error)
                return
            }

            data.results.forEach((m: Movie) => {
                m.validPoster = !!m.Poster && m.Poster !== 'N/A'
            })

            if (lazyMode.value) {
                results.value.push(...data.results)
            } else {
                results.value = data.results
            }

            totalResults.value = data.totalResults || 0
            totalPages.value = Math.ceil(totalResults.value / RESULTS_PER_PAGE)
            start.value = results.value.length > 0 ? (page.value - 1) * RESULTS_PER_PAGE + 1 : 0
            end.value = start.value + results.value.length - 1

            if (query.value.trim()) {
                recent_searches.value = [
                    query.value,
                    ...recent_searches.value.filter(q => q.toLowerCase() !== query.value.toLowerCase())
                ].slice(0, 5)
                sessionStorage.setItem('recent_searches', JSON.stringify(recent_searches.value))
            }

        } catch (e: any) {
            console.error('API fetch error:', e)
        } finally {
            loading.value = false
        }
    }

    async function search(reset = true) {
        if (reset) {
            results.value = []
            page.value = 1
        }

        await fetchPage()

        if (lazyMode.value) {
            await nextTick()
            await initObserver()
        }
    }

    async function toggleMode() {
        lazyMode.value = !lazyMode.value
        results.value = []
        page.value = 1

        await fetchPage()

        if (lazyMode.value) {
            await nextTick()
            await initObserver()
        } else {
            disconnectObserver()
        }
    }

    async function nextPage() {
        if (page.value < totalPages.value) {
            page.value++
            results.value = []
            await fetchPage()
        }
    }

    async function prevPage() {
        if (page.value > 1) {
            page.value--
            results.value = []
            await fetchPage()
        }
    }

    async function goToPage(p: number | string) {
        if (p !== '...' && p !== page.value) {
            page.value = Number(p)
            results.value = []
            await fetchPage()
        }
    }

    function handleBrokenImage(event: Event, movieItem: Movie) {
        movieItem.validPoster = false
        const el = event.target as HTMLImageElement
        if (el) el.style.display = 'none'
    }

    function removeRecent(idx: number) {
        recent_searches.value.splice(idx, 1)
        sessionStorage.setItem('recent_searches', JSON.stringify(recent_searches.value))
    }

    return {
        query,
        results,
        recent_searches,
        totalResults,
        totalPages,
        page,
        start,
        end,
        loading,
        lazyMode,
        pageList,
        search,
        nextPage,
        prevPage,
        goToPage,
        toggleMode,
        handleBrokenImage,
        removeRecent
    }
}
