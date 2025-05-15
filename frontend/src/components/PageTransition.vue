<template>
  <transition
    name="page"
    mode="out-in"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @enter-cancelled="enterCancelled"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
    @leave-cancelled="leaveCancelled"
  >
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: 'PageTransition',
  methods: {
    beforeEnter(el) {
      el.style.opacity = 0;
      el.style.transform = 'translateY(10px)';
    },
    enter(el, done) {
      setTimeout(() => {
        el.style.transition = 'all 0.3s ease-out';
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
        done();
      }, 50);
    },
    afterEnter(el) {
      el.style.transition = '';
    },
    enterCancelled(el) {
      // Cleanup if needed
    },
    beforeLeave(el) {
      el.style.opacity = 1;
    },
    leave(el, done) {
      el.style.transition = 'all 0.2s ease-in';
      el.style.opacity = 0;
      el.style.transform = 'translateY(-10px)';
      setTimeout(done, 200);
    },
    afterLeave(el) {
      el.style.transition = '';
      el.style.transform = '';
    },
    leaveCancelled(el) {
      // Cleanup if needed
    }
  }
};
</script>

<style scoped>
/* Fallback for browsers that don't support JavaScript transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

.page-enter-from {
  transform: translateY(10px);
}

.page-leave-to {
  transform: translateY(-10px);
}
</style>
