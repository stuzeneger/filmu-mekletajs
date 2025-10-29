import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Spinner from '@/components/Spinner.vue'

describe('Spinner.vue', () => {
    it('renders the spinner element', () => {
        const wrapper = mount(Spinner)
        expect(wrapper.classes()).toContain('spinner')
    })

    it('matches snapshot', () => {
        const wrapper = mount(Spinner)
        expect(wrapper.html()).toMatchSnapshot()
    })
})
