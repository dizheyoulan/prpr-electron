import type { Directive } from 'vue'

export const vLazy: Directive<HTMLImageElement, string> = {
  mounted(el, binding) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.src = binding.value
          observer.unobserve(el)
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      el.src = binding.value
    }
  }
}
