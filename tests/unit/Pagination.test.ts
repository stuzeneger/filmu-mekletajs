import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Pagination from '@/components/Pagination.vue'

describe('Pagination.vue', () => {
    it('renders correct number of page buttons', () => {
        const wrapper = mount(Pagination, {
            props: {
                page: 1,
                totalPages: 5,
                maxVisiblePages: 5
            }
        })

        // Skaitām tikai pogas (ne ellipsis)
        const buttons = wrapper.findAll('button').filter(btn => !btn.classes('ellipsis'))
        expect(buttons.length).toBe(7) // prev + 5 pages + next
    })

    it('disables prev button on first page', () => {
        const wrapper = mount(Pagination, { props: { page: 1, totalPages: 5 } })
        const prevButton = wrapper.find('button:first-child')
        expect(prevButton.attributes('disabled')).toBeDefined()
    })

    it('disables next button on last page', () => {
        const wrapper = mount(Pagination, { props: { page: 5, totalPages: 5 } })
        const nextButton = wrapper.find('button:last-child')
        expect(nextButton.attributes('disabled')).toBeDefined()
    })

    it('emits prev-page when prev button clicked', async () => {
        const wrapper = mount(Pagination, { props: { page: 3, totalPages: 5 } })
        const prevButton = wrapper.find('button:first-child')
        await prevButton.trigger('click')
        expect(wrapper.emitted('prev-page')).toBeTruthy()
        expect(wrapper.emitted('prev-page')?.length).toBe(1)
    })

    it('emits next-page when next button clicked', async () => {
        const wrapper = mount(Pagination, { props: { page: 3, totalPages: 5 } })
        const nextButton = wrapper.find('button:last-child')
        await nextButton.trigger('click')
        expect(wrapper.emitted('next-page')).toBeTruthy()
        expect(wrapper.emitted('next-page')?.length).toBe(1)
    })

    it('emits go-to-page with correct page number when page button clicked', async () => {
        const wrapper = mount(Pagination, { props: { page: 3, totalPages: 5 } })
        const pageButtons = wrapper.findAll('button').filter(btn => !btn.classes('ellipsis'))

        // Klikšķis uz pogas ar numuru 4
        const targetBtn = pageButtons.find(btn => btn.text() === '4')
        await targetBtn?.trigger('click')

        expect(wrapper.emitted('go-to-page')).toBeTruthy()
        expect(wrapper.emitted('go-to-page')?.[0]).toEqual([4])
    })

    it('renders ellipsis when needed', () => {
        const wrapper = mount(Pagination, { props: { page: 5, totalPages: 10, maxVisiblePages: 5 } })
        const ellipsis = wrapper.findAll('.ellipsis')
        expect(ellipsis.length).toBeGreaterThan(0)
    })
})
