import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import MovieInfoPopup, { type Movie } from '@/components/MovieInfoPopup.vue'

describe('MovieInfoPopup.vue', () => {
    const sampleMovie: Movie = {
        imdbID: '1',
        Title: 'Test Movie',
        Year: '2023',
        Poster: 'poster.jpg',
        validPoster: true,
        Genre: 'Action',
        Director: 'John Doe',
        Actors: 'Actor A, Actor B',
        Plot: 'Test plot',
        imdbRating: '8.5'
    }

    it('renders correctly when closed', () => {
        const wrapper = mount(MovieInfoPopup, { props: { isOpen: false } })
        expect(wrapper.classes()).not.toContain('show')
    })

    it('renders correctly when open with movie', () => {
        const wrapper = mount(MovieInfoPopup, { props: { isOpen: true, movie: sampleMovie } })
        expect(wrapper.classes()).toContain('show')
        expect(wrapper.find('h3').text()).toBe(`${sampleMovie.Title} (${sampleMovie.Year})`)
        expect(wrapper.find('img').attributes('src')).toBe(sampleMovie.Poster)
        expect(wrapper.find('p').text()).toContain('Žanrs')
    })

    it('renders error message if error prop is set', () => {
        const wrapper = mount(MovieInfoPopup, { props: { isOpen: true, error: 'API error' } })
        const errorEl = wrapper.find('.error-message')
        expect(errorEl.exists()).toBe(true)
        expect(errorEl.text()).toBe('API error')
    })

    it('emits close event when overlay is clicked', async () => {
        const wrapper = mount(MovieInfoPopup, { props: { isOpen: true, movie: sampleMovie } })
        await wrapper.trigger('click.self')
        expect(wrapper.emitted('close')).toBeTruthy()
        expect(wrapper.emitted('close')?.length).toBe(1)
    })

    it('emits close event when close button is clicked', async () => {
        const wrapper = mount(MovieInfoPopup, { props: { isOpen: true, movie: sampleMovie } })
        await wrapper.find('.modal-close').trigger('click')
        expect(wrapper.emitted('close')).toBeTruthy()
        expect(wrapper.emitted('close')?.length).toBe(1)
    })
})
