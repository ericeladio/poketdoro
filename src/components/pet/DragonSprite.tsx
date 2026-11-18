import type { Mood, Stage } from '../../types.ts'
import { PixelSprite } from '../ui/PixelSprite.tsx'
import { ICONS } from '../../data/icons.ts'
import {
  DRAGON_BODY,
  DRAGON_CREST,
  DRAGON_EYES,
  DRAGON_FLAME,
  DRAGON_PALETTE,
} from './dragonArt.ts'

interface DragonSpriteProps {
  mood: Mood
  stage: Stage
  static?: boolean
}

export function DragonSprite({ mood, stage, static: isStatic }: DragonSpriteProps) {
  return (
    <div
      className={`dragon dragon-${mood} dragon-stage-${stage}${isStatic ? ' is-static' : ''}`}
      aria-hidden
    >
      <div className="dragon-inner">
        <PixelSprite
          className="dragon-layer dragon-body"
          rows={DRAGON_BODY}
          palette={DRAGON_PALETTE}
        />
        <PixelSprite
          className="dragon-layer dragon-eyes"
          rows={DRAGON_EYES}
          palette={DRAGON_PALETTE}
        />
        <span className="dragon-flame">
          <PixelSprite
            className="dragon-flame-svg"
            rows={DRAGON_FLAME}
            palette={DRAGON_PALETTE}
          />
        </span>
        {stage === 'emberwing' ? (
          <span className="dragon-crest">
            <PixelSprite
              className="dragon-crest-svg"
              rows={DRAGON_CREST}
              palette={DRAGON_PALETTE}
            />
          </span>
        ) : null}
        {mood === 'sick' ? (
          <span className="dragon-sweat">
            <PixelSprite rows={ICONS.drop} />
          </span>
        ) : null}
      </div>

      {mood === 'sleeping' ? (
        <div className="dragon-zzz" aria-hidden>
          <span>Z</span>
          <span>Z</span>
          <span>Z</span>
        </div>
      ) : null}

      {mood === 'celebrating' ? (
        <div className="dragon-hearts" aria-hidden>
          <span className="heart h1">
            <PixelSprite rows={ICONS.heart} />
          </span>
          <span className="heart h2">
            <PixelSprite rows={ICONS.heart} />
          </span>
          <span className="heart h3">
            <PixelSprite rows={ICONS.heart} />
          </span>
        </div>
      ) : null}
    </div>
  )
}
