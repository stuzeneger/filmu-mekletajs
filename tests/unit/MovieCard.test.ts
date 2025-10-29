import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import MovieCard, { MovieItem } from '../../src/components/MovieCard.vue'

describe('MovieCard.vue', () => {
    const movie: MovieItem = {
        imdbID: 'tt1234567',
        Title: 'Matrix',
        Year: '1999',
        Poster: 'matrix.jpg',
        validPoster: true
    }

    it('renders movie title and year', () => {
        const wrapper = mount(MovieCard, {
            props: { movieItem: movie }
        })
        expect(wrapper.find('.card-title').text()).toBe('Matrix')
        expect(wrapper.find('.card-year').text()).toBe('1999')
    })

    it('shows poster image if validPoster is true', () => {
        const wrapper = mount(MovieCard, {
            props: { movieItem: movie }
        })
        const img = wrapper.find('img')
        expect(img.exists()).toBe(true)
        expect(img.attributes('src')).toBe('matrix.jpg')
        expect(img.attributes('alt')).toBe('Matrix')
    })

    it('does not show poster image if validPoster is false', () => {
        const wrapper = mount(MovieCard, {
            props: { movieItem: { ...movie, validPoster: false } }
        })
        const img = wrapper.find('img')
        expect(img.exists()).toBe(false)
    })

    it('emits "view-movie" event on click', async () => {
        const wrapper = mount(MovieCard, {
            props: { movieItem: movie }
        })
        await wrapper.trigger('click')
        expect(wrapper.emitted()).toHaveProperty('view-movie')
        expect(wrapper.emitted('view-movie')?.[0]).toEqual(['tt1234567'])
    })

    it('emits "broken-image" event on image error', async () => {
        const wrapper = mount(MovieCard, {
            props: { movieItem: movie }
        })
        const img = wrapper.find('img')
        await img.trigger('error')
        expect(wrapper.emitted()).toHaveProperty('broken-image')
        const eventPayload = wrapper.emitted('broken-image')?.[0]
        expect(eventPayload?.[1]).toEqual(movie)
    })

    it('applies "loaded" class when loading is false', () => {
        const wrapper = mount(MovieCard, {
            props: { movieItem: movie, loading: false }
        })
        expect(wrapper.classes()).toContain('loaded')
    })

    it('does not apply "loaded" class when loading is true', () => {
        const wrapper = mount(MovieCard, {
            props: { movieItem: movie, loading: true }
        })
        expect(wrapper.classes()).not.toContain('loaded')
    })
})
