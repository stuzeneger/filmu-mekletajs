import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import ListSwitcherButton from '../../src/components/ListSwitcherButton.vue'

describe('ListSwitcherButton.vue', () => {
    it('renders correctly with default labels', () => {
        const wrapper = mount(ListSwitcherButton, {
            props: { isOn: false }
        })
        const label = wrapper.find('.switch-label')
        expect(label.text()).toBe('Lēnā ielāde') // offLabel default
    })

    it('renders correctly with isOn = true', () => {
        const wrapper = mount(ListSwitcherButton, {
            props: { isOn: true }
        })
        const label = wrapper.find('.switch-label')
        expect(label.text()).toBe('Dalīts pa lapām') // onLabel default
    })

    it('renders custom labels', () => {
        const wrapper = mount(ListSwitcherButton, {
            props: {
                isOn: true,
                onLabel: 'ON MODE',
                offLabel: 'OFF MODE'
            }
        })
        const label = wrapper.find('.switch-label')
        expect(label.text()).toBe('ON MODE')
    })

    it('emits toggle event when clicked', async () => {
        const wrapper = mount(ListSwitcherButton, {
            props: { isOn: false }
        })
        await wrapper.trigger('click')
        expect(wrapper.emitted()).toHaveProperty('toggle')
        expect(wrapper.emitted('toggle')?.length).toBe(1)
    })

    it('applies correct class based on isOn', () => {
        const wrapperOn = mount(ListSwitcherButton, { props: { isOn: true } })
        const wrapperOff = mount(ListSwitcherButton, { props: { isOn: false } })
        expect(wrapperOn.find('.switch').classes()).toContain('on')
        expect(wrapperOff.find('.switch').classes()).toContain('off')
    })
})

