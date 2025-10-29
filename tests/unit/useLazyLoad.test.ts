import { ref, nextTick, type Ref } from 'vue'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useLazyLoad } from '@/composables/useLazyLoad'

describe('useLazyLoad', () => {
  let fetchPageMock: () => Promise<void>

  beforeEach(() => {
    // Mock IntersectionObserver
    (global as any).IntersectionObserver = vi.fn(function (this: any, cb: any) {
      this.observe = vi.fn()
      this.disconnect = vi.fn()
      this.trigger = (entry: any) => cb([entry])
    })

    fetchPageMock = vi.fn().mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize observer and observe last card', async () => {
    const loading = ref(false)
    const page = ref(1)
    const totalPages = ref(3)

    const { initObserver, disconnectObserver, observeLastCard } = useLazyLoad(
      fetchPageMock,
      loading,
      page,
      totalPages
    )

    // Pārbaudām, ka sākotnēji observer ir null
    expect((initObserver as any).observer).toBeUndefined()

    await initObserver()
    expect(global.IntersectionObserver).toHaveBeenCalled()
  })

  it('should call fetchPage when last card intersects', async () => {
    const loading = ref(false)
    const page = ref(1)
    const totalPages = ref(3)

    const { initObserver } = useLazyLoad(fetchPageMock, loading, page, totalPages)

    await initObserver()

    // Trigger intersection
    const observerInstance = (global as any).IntersectionObserver.mock.results[0].value
    await observerInstance.trigger({ isIntersecting: true })

    expect(fetchPageMock).toHaveBeenCalled()
  })

  it('should disconnect observer', async () => {
    const loading = ref(false)
    const page = ref(1)
    const totalPages = ref(3)

    const { initObserver, disconnectObserver } = useLazyLoad(fetchPageMock, loading, page, totalPages)

    await initObserver()

    const observerInstance = (global as any).IntersectionObserver.mock.results[0].value
    disconnectObserver()

    expect(observerInstance.disconnect).toHaveBeenCalled()
  })

  it('should not call fetchPage if loading is true', async () => {
    const loading = ref(true)
    const page = ref(1)
    const totalPages = ref(3)

    const { initObserver } = useLazyLoad(fetchPageMock, loading, page, totalPages)
    await initObserver()

    const observerInstance = (global as any).IntersectionObserver.mock.results[0].value
    await observerInstance.trigger({ isIntersecting: true })

    expect(fetchPageMock).not.toHaveBeenCalled()
  })

  it('should not call fetchPage if page >= totalPages', async () => {
    const loading = ref(false)
    const page = ref(3)
    const totalPages = ref(3)

    const { initObserver } = useLazyLoad(fetchPageMock, loading, page, totalPages)
    await initObserver()

    const observerInstance = (global as any).IntersectionObserver.mock.results[0].value
    await observerInstance.trigger({ isIntersecting: true })

    expect(fetchPageMock).not.toHaveBeenCalled()
  })
})
