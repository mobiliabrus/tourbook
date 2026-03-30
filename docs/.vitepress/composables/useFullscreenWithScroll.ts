import { ref, onMounted, onUnmounted } from 'vue';

export function useFullscreenWithScroll() {
  const isFullscreen = ref(false);
  let pageYOffset = window.pageYOffset;

  const handleFullscreen = (element: Element) => {
    if (!element) return;

    if (
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).msFullscreenElement
    ) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      setTimeout(() => {
        window.scrollTo({ top: pageYOffset });
      }, 100);
    } else {
      pageYOffset = window.pageYOffset;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((document as any).webkitRequestFullscreen) {
        (document as any).webkitRequestFullscreen();
      } else if ((document as any).msRequestFullscreen) {
        (document as any).msRequestFullscreen();
      }
    }
  };

  const updateFullscreenState = () => {
    const fullscreenElement =
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement;
    isFullscreen.value = !!fullscreenElement;
  };

  onMounted(() => {
    document.addEventListener('fullscreenchange', updateFullscreenState);
    document.addEventListener('webkitfullscreenchange', updateFullscreenState);
    document.addEventListener('mozfullscreenchange', updateFullscreenState);
    document.addEventListener('MSFullscreenChange', updateFullscreenState); // IE11
  });

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', updateFullscreenState);
    document.removeEventListener('webkitfullscreenchange', updateFullscreenState);
    document.removeEventListener('mozfullscreenchange', updateFullscreenState);
    document.removeEventListener('MSFullscreenChange', updateFullscreenState);
  });

  return {
    handleFullscreen,
    isFullscreen,
  };
}
