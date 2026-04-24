<template>
  <div
    class="marquee-logo-root inline-flex select-none"
    :class="compact ? 'scale-90 sm:scale-100 origin-left' : ''"
    aria-hidden="true"
  >
    <div class="marquee-logo-frame rounded-lg p-[3px]">
      <div
        class="marquee-logo-inner flex items-center justify-center rounded-md px-5 py-2 sm:px-6 sm:py-2.5 bg-terminal-green shadow-[0_0_24px_rgba(0,255,65,0.35),inset_0_1px_0_rgba(255,255,255,0.25)]"
      >
        <span
          class="terminal-text font-bold tracking-tight text-black leading-none"
          :class="compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'"
        >
          IP
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  /** Slightly smaller for dense layouts (e.g. footer). */
  compact: { type: Boolean, default: false }
})
</script>

<style scoped>
.marquee-logo-frame {
  background: linear-gradient(
    90deg,
    rgba(0, 255, 65, 0.15),
    rgba(0, 217, 255, 0.55),
    rgba(0, 255, 65, 0.9),
    rgba(157, 78, 221, 0.45),
    rgba(0, 255, 65, 0.15)
  );
  background-size: 300% 100%;
  animation: marquee-logo-shift 4s linear infinite;
  box-shadow:
    0 0 0 1px rgba(0, 255, 65, 0.35),
    0 0 20px rgba(0, 255, 65, 0.12);
}

@keyframes marquee-logo-shift {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-logo-frame {
    animation: none;
    background: linear-gradient(
      135deg,
      rgba(0, 255, 65, 0.35),
      rgba(0, 217, 255, 0.4),
      rgba(0, 255, 65, 0.35)
    );
    background-size: 100% 100%;
  }
}
</style>
