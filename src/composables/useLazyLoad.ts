import { ref, onBeforeUnmount, nextTick, type Ref } from 'vue'

export function useLazyLoad(
    fetchPage: () => Promise<void>,
    loading: Ref<boolean>,
    page: Ref<number>,
    totalPages: Ref<number>
) {
    const observer = ref<IntersectionObserver | null>(null)

    const observeLastCard = async () => {
        await nextTick()
        if (typeof document === 'undefined') return // aizsardzība testiem/SSR
        if (!observer.value) return

        const cards = document.querySelectorAll('.card')
        const lastCard = cards[cards.length - 1]
        if (lastCard) observer.value.observe(lastCard)
    }

    const initObserver = async () => {
        disconnectObserver()

        if (typeof IntersectionObserver === 'undefined') return // mock/Node

        observer.value = new IntersectionObserver(async (entries) => {
            const entry = entries[0]
            if (entry.isIntersecting && !loading.value && page.value < totalPages.value) {
                page.value++
                await fetchPage()
                await observeLastCard()
            }
        }, { rootMargin: '200px' })

        await observeLastCard()
    }

    const disconnectObserver = () => {
        if (observer.value) {
            observer.value.disconnect()
            observer.value = null
        }
    }

    onBeforeUnmount(() => {
        disconnectObserver()
    })

    return { initObserver, disconnectObserver, observeLastCard }
}
