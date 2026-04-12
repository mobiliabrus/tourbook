import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import _debounce from './debounce.min.js'
import TapDetector from './TapDetector'

export interface UseZoomerOptions {
  minScale?: number
  maxScale?: number
  zoomed?: boolean
  resetTrigger?: number
  aspectRatio?: number
  backgroundColor?: string
  pivot?: 'cursor' | 'image-center'
  zoomingElastic?: boolean
  limitTranslation?: boolean
  doubleClickToZoom?: boolean
  mouseWheelToZoom?: boolean
}

export function useZoomer(options: UseZoomerOptions = {}) {
  const {
    minScale = 1,
    maxScale = 5,
    resetTrigger = 1e5,
    aspectRatio = 1,
    backgroundColor = 'transparent',
    pivot = 'cursor',
    zoomingElastic = true,
    limitTranslation = true,
    doubleClickToZoom = true,
    mouseWheelToZoom = true,
  } = options

  const root = ref<HTMLElement | null>(null)
  
  // Container sizes
  const containerWidth = ref(1)
  const containerHeight = ref(1)
  const containerLeft = ref(0)
  const containerTop = ref(0)

  // Store values for transformations
  const translateX = ref(0)
  const animTranslateX = ref(0)
  const translateY = ref(0)
  const animTranslateY = ref(0)
  const scale = ref(1)
  const animScale = ref(1)

  // Mouse states
  const lastFullWheelTime = ref(0)
  const lastWheelTime = ref(0)
  const lastWheelDirection = ref<'x' | 'y'>('y')
  const isPointerDown = ref(false)
  const pointerPosX = ref(-1)
  const pointerPosY = ref(-1)
  const twoFingerInitDist = ref(0)
  const panLocked = ref(true)

  let raf: number | null = null
  let tapDetector: InstanceType<typeof TapDetector> | null = null

  // Computed wrapper style
  const wrapperStyle = computed(() => {
    const x = containerWidth.value * animTranslateX.value
    const y = containerHeight.value * animTranslateY.value
    return {
      transform: `translate(${x}px, ${y}px) scale(${animScale.value})`,
    }
  })

  // Watch for scale changes
  watch(scale, (val) => {
    if (val !== 1) {
      panLocked.value = false
    }
  })

  // Watch for reset trigger
  watch(() => resetTrigger, () => {
    reset()
  })

  // API methods
  const reset = () => {
    scale.value = 1
    panLocked.value = true
    translateX.value = 0
    translateY.value = 0
  }

  const zoomIn = (s = 2) => {
    tryToScale(s)
    onInteractionEnd()
  }

  const zoomOut = (s = 0.5) => {
    tryToScale(s)
    onInteractionEnd()
  }

  // Main logic - scale
  const tryToScale = (scaleDelta: number) => {
    let newScale = scale.value * scaleDelta
    if (zoomingElastic) {
      if (newScale < minScale || newScale > maxScale) {
        let log = Math.log2(scaleDelta)
        log *= 0.2
        scaleDelta = Math.pow(2, log)
        newScale = scale.value * scaleDelta
      }
    } else {
      if (newScale < minScale) newScale = minScale
      else if (newScale > maxScale) newScale = maxScale
    }
    scaleDelta = newScale / scale.value
    scale.value = newScale
    if (pivot !== 'image-center') {
      const normMousePosX = (pointerPosX.value - containerLeft.value) / containerWidth.value
      const normMousePosY = (pointerPosY.value - containerTop.value) / containerHeight.value
      translateX.value = (0.5 + translateX.value - normMousePosX) * scaleDelta + normMousePosX - 0.5
      translateY.value = (0.5 + translateY.value - normMousePosY) * scaleDelta + normMousePosY - 0.5
    }
  }

  const setPointerPosCenter = () => {
    pointerPosX.value = containerLeft.value + containerWidth.value / 2
    pointerPosY.value = containerTop.value + containerHeight.value / 2
  }

  // Pan logic
  const onPointerMove = (newMousePosX: number, newMousePosY: number) => {
    if (isPointerDown.value) {
      const pixelDeltaX = newMousePosX - pointerPosX.value
      const pixelDeltaY = newMousePosY - pointerPosY.value
      if (!panLocked.value) {
        translateX.value += pixelDeltaX / containerWidth.value
        translateY.value += pixelDeltaY / containerHeight.value
      }
    }
    pointerPosX.value = newMousePosX
    pointerPosY.value = newMousePosY
  }

  const onInteractionEnd = _debounce(() => {
    limit()
    panLocked.value = scale.value === 1
  }, 100)

  // Limit scale and translation
  const limit = () => {
    if (scale.value < minScale) {
      scale.value = minScale
    } else if (scale.value > maxScale) {
      tryToScale(maxScale / scale.value)
    }
    if (limitTranslation) {
      const translateLimit = calcTranslateLimit()
      if (Math.abs(translateX.value) > translateLimit.x) {
        translateX.value *= translateLimit.x / Math.abs(translateX.value)
      }
      if (Math.abs(translateY.value) > translateLimit.y) {
        translateY.value *= translateLimit.y / Math.abs(translateY.value)
      }
    }
  }

  const calcTranslateLimit = () => {
    if (getMarginDirection() === 'y') {
      const imageToContainerRatio = containerWidth.value / aspectRatio / containerHeight.value
      let translateLimitY = (scale.value * imageToContainerRatio - 1) / 2
      if (translateLimitY < 0) translateLimitY = 0
      return {
        x: (scale.value - 1) / 2,
        y: translateLimitY,
      }
    } else {
      const imageToContainerRatio = (containerHeight.value * aspectRatio) / containerWidth.value
      let translateLimitX = (scale.value * imageToContainerRatio - 1) / 2
      if (translateLimitX < 0) translateLimitX = 0
      return {
        x: translateLimitX,
        y: (scale.value - 1) / 2,
      }
    }
  }

  const getMarginDirection = (): 'x' | 'y' => {
    const containerRatio = containerWidth.value / containerHeight.value
    return containerRatio > aspectRatio ? 'x' : 'y'
  }

  const onDoubleTap = (ev: { clientX: number; clientY: number }) => {
    if (scale.value === 1) {
      if (ev.clientX > 0) {
        pointerPosX.value = ev.clientX
        pointerPosY.value = ev.clientY
      }
      tryToScale(Math.min(3, maxScale))
    } else {
      reset()
    }
    onInteractionEnd()
  }

  // Reactive handlers
  const onWindowResize = () => {
    if (!root.value) return
    const styles = window.getComputedStyle(root.value)
    containerWidth.value = parseFloat(styles.width)
    containerHeight.value = parseFloat(styles.height)
    setPointerPosCenter()
    limit()
  }

  const refreshContainerPos = () => {
    if (!root.value) return
    const rect = root.value.getBoundingClientRect()
    containerLeft.value = rect.left
    containerTop.value = rect.top
  }

  const loop = () => {
    animScale.value = gainOn(animScale.value, scale.value)
    animTranslateX.value = gainOn(animTranslateX.value, translateX.value)
    animTranslateY.value = gainOn(animTranslateY.value, translateY.value)
    raf = window.requestAnimationFrame(loop)
  }

  const gainOn = (from: number, to: number): number => {
    const delta = (to - from) * 0.3
    if (Math.abs(delta) > 1e-5) {
      return from + delta
    } else {
      return to
    }
  }

  // Mouse events
  const onMouseWheel = (ev: WheelEvent) => {
    if (!mouseWheelToZoom) return
    ev.preventDefault()
    if ((ev as any).detail) (ev as any).wheelDelta = (ev as any).detail * -10
    const currTime = Date.now()
    if (Math.abs((ev as any).wheelDelta) === 120) {
      if (currTime - lastFullWheelTime.value > 50) {
        onMouseWheelDo((ev as any).wheelDelta)
        lastFullWheelTime.value = currTime
      }
    } else {
      if (currTime - lastWheelTime.value > 50 && typeof ev.deltaX === 'number') {
        lastWheelDirection.value = Math.abs(ev.deltaX) > Math.abs(ev.deltaY) ? 'x' : 'y'
      }
      if (lastWheelDirection.value === 'y') {
        onMouseWheelDo((ev as any).wheelDelta)
      }
    }
    lastWheelTime.value = currTime
  }

  const onMouseWheelDo = (wheelDelta: number) => {
    const scaleDelta = Math.pow(1.25, wheelDelta / 120)
    tryToScale(scaleDelta)
    onInteractionEnd()
  }

  const onMouseDown = (ev: MouseEvent) => {
    refreshContainerPos()
    isPointerDown.value = true
    pointerPosX.value = ev.clientX
    pointerPosY.value = ev.clientY
  }

  const onMouseUp = () => {
    isPointerDown.value = false
    onInteractionEnd()
  }

  const onMouseMove = (ev: MouseEvent) => {
    onPointerMove(ev.clientX, ev.clientY)
  }

  // Touch events
  const onTouchStart = (ev: TouchEvent) => {
    if (ev.touches.length === 1) {
      refreshContainerPos()
      pointerPosX.value = ev.touches[0].clientX
      pointerPosY.value = ev.touches[0].clientY
      isPointerDown.value = true
    } else if (ev.touches.length === 2) {
      isPointerDown.value = true
      pointerPosX.value = (ev.touches[0].clientX + ev.touches[1].clientX) / 2
      pointerPosY.value = (ev.touches[0].clientY + ev.touches[1].clientY) / 2
      const distX = ev.touches[0].clientX - ev.touches[1].clientX
      const distY = ev.touches[0].clientY - ev.touches[1].clientY
      twoFingerInitDist.value = Math.sqrt(distX * distX + distY * distY)
    }
  }

  const onTouchEnd = (ev: TouchEvent) => {
    if (ev.touches.length === 0) {
      isPointerDown.value = false
      if (Math.abs(scale.value - 1) < 0.1) scale.value = 1
      onInteractionEnd()
    } else if (ev.touches.length === 1) {
      pointerPosX.value = ev.touches[0].clientX
      pointerPosY.value = ev.touches[0].clientY
    }
  }

  const onTouchMove = (ev: TouchEvent) => {
    if (ev.touches.length === 1) {
      onPointerMove(ev.touches[0].clientX, ev.touches[0].clientY)
    } else if (ev.touches.length === 2) {
      const newMousePosX = (ev.touches[0].clientX + ev.touches[1].clientX) / 2
      const newMousePosY = (ev.touches[0].clientY + ev.touches[1].clientY) / 2
      onPointerMove(newMousePosX, newMousePosY)
      pointerPosX.value = newMousePosX
      pointerPosY.value = newMousePosY
      const distX = ev.touches[0].clientX - ev.touches[1].clientX
      const distY = ev.touches[0].clientY - ev.touches[1].clientY
      const newTwoFingerDist = Math.sqrt(distX * distX + distY * distY)
      tryToScale(newTwoFingerDist / twoFingerInitDist.value)
      twoFingerInitDist.value = newTwoFingerDist
    }
  }

  // Lifecycle
  onMounted(() => {
    if (!root.value) return
    
    tapDetector = new TapDetector()
    tapDetector.attach(root.value)
    if (doubleClickToZoom) {
      tapDetector.onDoubleTap(onDoubleTap)
    }
    
    window.addEventListener('resize', onWindowResize)
    onWindowResize()
    refreshContainerPos()
    loop()
  })

  onBeforeUnmount(() => {
    if (tapDetector && root.value) {
      tapDetector.detach(root.value)
    }
    window.removeEventListener('resize', onWindowResize)
    if (raf !== null) {
      window.cancelAnimationFrame(raf)
    }
  })

  return {
    root,
    wrapperStyle,
    backgroundColor,
    scale,
    reset,
    zoomIn,
    zoomOut,
    onMouseWheel,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    setPointerPosCenter,
    onTouchStart,
    onTouchEnd,
    onTouchMove,
  }
}
