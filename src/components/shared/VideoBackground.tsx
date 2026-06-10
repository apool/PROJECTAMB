'use client'

import { useEffect, useRef } from 'react'

export function VideoBackground() {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const onTimeUpdate = () => {
      if (video.duration && video.currentTime >= video.duration - 0.15) {
        video.currentTime = 0
      }
    }
    video.addEventListener('timeupdate', onTimeUpdate)
    return () => video.removeEventListener('timeupdate', onTimeUpdate)
  }, [])

  return (
    <video
      ref={ref}
      autoPlay
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover opacity-40"
    >
      <source src="/img/Fogo.mp4" type="video/mp4" />
    </video>
  )
}
