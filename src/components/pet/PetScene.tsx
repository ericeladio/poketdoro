import type { Mood, Stage } from '../../types.ts'
import { DragonSprite } from './DragonSprite.tsx'
import { PixelSprite } from '../ui/PixelSprite.tsx'
import { ICONS } from '../../data/icons.ts'

interface PetSceneProps {
  mood: Mood
  stage: Stage
  dialogue: string
  tone?: 'day' | 'sunset' | 'night'
  static?: boolean
  children?: React.ReactNode
}

export function PetScene({
  mood,
  stage,
  dialogue,
  tone = 'day',
  static: isStatic,
  children,
}: PetSceneProps) {
  return (
    <section className={`scene scene-${tone} scene-mood-${mood}`}>
      <div className="scene-decor" aria-hidden>
        <span className="scene-sun">
          <PixelSprite rows={tone === 'night' ? ICONS.moon : ICONS.sun} size={34} />
        </span>
        <span className="scene-cloud cloud-1" />
        <span className="scene-cloud cloud-2" />
        <span className="scene-cloud cloud-3" />
        <span className="scene-hill hill-back" />
        <span className="scene-hill hill-front" />
        <span className="scene-grass" />
        <span className="scene-tree tree-1" />
        <span className="scene-tree tree-2" />
        <span className="scene-tree tree-3" />
      </div>

      <div className="scene-bubble">
        <p>{dialogue}</p>
      </div>

      <div className="scene-pet">
        <DragonSprite mood={mood} stage={stage} static={isStatic} />
      </div>

      {children}
    </section>
  )
}
