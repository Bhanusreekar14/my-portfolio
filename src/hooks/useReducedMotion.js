import { useSyncExternalStore } from "react"

const QUERY = "(prefers-reduced-motion: reduce)"

function subscribe(onChange) {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {}
  }

  const mq = window.matchMedia(QUERY)

  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }

  if (typeof mq.addListener === "function") {
    mq.addListener(onChange)
    return () => mq.removeListener(onChange)
  }

  return () => {}
}

function getSnapshot() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false
  }
  return window.matchMedia(QUERY).matches
}

function getServerSnapshot() {
  return false
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export default useReducedMotion
