import { mount, shallowMount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import App from '../../src/App.vue'

// Mock validator
vi.mock('@/validators/SearchValidator', () => ({
    SearchValidator: class {
        isValid = (query: string) => query.length >= 3
    }
}))

// Mock useMoviesSearcher
vi.mock('@/composables/useMoviesSearcher', () => ({
    useMoviesSearcher: () => ({
        query: ref(''),
        results: ref([]),
        recent_searches: ref([]),
        totalResults: ref(0),
        totalPages: ref(0),
        page: ref(1),
        start: ref(0),
        end: ref(0),
        loading: ref(false),
        lazyMode: ref(false),
        search: vi.fn(),
        nextPage: vi.fn(),
        prevPage: vi.fn(),
        goToPage: vi.fn(),
        toggleMode: vi.fn(),
        handleBrokenImage: vi.fn(),
        removeRecent: vi.fn(),
    })
}))

describe('App.vue', () => {
    // Stubs for child components
    const stubs = {
        ListSwitcherButton: {
            template: `<button @click="$emit('toggle')"></button>`,
            props: ['isOn']
        },
        MovieCard: true,
        Spinner: true,
        Pagination: true
    }

    it('renders the title', () => {
        const wrapper = mount(App, { global: { stubs } })
        expect(wrapper.find('h1').text()).toBe('Filmu meklētājs')
    })

    it('disables search button when query is too short', async () => {
        const wrapper = shallowMount(App, { global: { stubs } })
        const input = wrapper.find('input[type="text"]')
        await input.setValue('Ma') // <3 chars
        await wrapper.vm.$nextTick()
        const button = wrapper.find('button.search-btn').element as HTMLButtonElement
        expect(button.disabled).toBe(true)
    })

    it('enables search button when query is long enough', async () => {
        const wrapper = shallowMount(App, { global: { stubs } })
        const input = wrapper.find('input[type="text"]')
        await input.setValue('Matrix') // >=3 chars
        await wrapper.vm.$nextTick()
        const button = wrapper.find('button.search-btn').element as HTMLButtonElement
        expect(button.disabled).toBe(false)
    })

    it('renders ListSwitcherButton component', () => {
        const wrapper = mount(App, { global: { stubs } })
        expect(wrapper.findComponent(stubs.ListSwitcherButton).exists()).toBe(true)
    })
})
