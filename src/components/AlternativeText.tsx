import React from 'react'
import { Button } from "@/components/ui/button"

interface AlternativeTextProps {
  original: string
  simplified: string
  bullets: string[]
}

export const AlternativeText: React.FC<AlternativeTextProps> = ({ original, simplified, bullets }) => {
  const [mode, setMode] = React.useState<'original' | 'simplified' | 'bullets'>('original')

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Button onClick={() => setMode('original')} className={`btn-secondary ${mode === 'original' ? 'ring-2 ring-primary' : ''}`}>Original</Button>
        <Button onClick={() => setMode('simplified')} className={`btn-secondary ${mode === 'simplified' ? 'ring-2 ring-primary' : ''}`}>Simplified</Button>
        <Button onClick={() => setMode('bullets')} className={`btn-secondary ${mode === 'bullets' ? 'ring-2 ring-primary' : ''}`}>Bullet Points</Button>
      </div>
      {mode === 'original' && <p>{original}</p>}
      {mode === 'simplified' && <p>{simplified}</p>}
      {mode === 'bullets' && (
        <ul className="list-disc pl-5">
          {bullets.map((bullet, index) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

