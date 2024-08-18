import { useEffect, useState } from "react"

export interface IViewport {
  width: number
  height: number
  isMobile: boolean
}

const mobileThreshold = 840

function getDimensions() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < mobileThreshold,
  }
}

export function useViewport() {
  const [viewport, setViewport] = useState<IViewport>(getDimensions())

  function handleResize() {
    setViewport(getDimensions())
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return viewport
}
