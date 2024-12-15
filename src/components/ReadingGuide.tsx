import React, { useState, useEffect } from 'react'

interface ReadingGuideProps {
  isActive: boolean
  mode: 'guide' | 'focus'
}

export const ReadingGuide: React.FC<ReadingGuideProps> = ({ isActive, mode }) => {
  const [position, setPosition] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isActive) {
        setPosition(e.clientY)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isActive])

  if (!isActive) return null

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        height: mode === 'guide' ? '2px' : '30px',
        backgroundColor: mode === 'guide' ? 'red' : 'rgba(255, 255, 0, 0.2)',
        top: mode === 'guide' ? `${position}px` : `${position - 15}px`,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  )
}