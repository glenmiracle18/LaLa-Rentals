"use client"

import { Volume2, VolumeX } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function SoundButton() {
  const [isMuted, setIsMuted] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio("/background-sound.mp3")
    audioRef.current.loop = true
    audioRef.current.volume = 0.1
    
  }, [])

  const toggleSound = () => {
    if (!audioRef.current) return

    if (isMuted) {
      audioRef.current.play()
      
    } else {
      audioRef.current.pause()
    }
    setIsMuted(!isMuted)
  }

  return (
    <button
      onClick={toggleSound}
      className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-500"
    >
      {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
    </button>
  )
}

