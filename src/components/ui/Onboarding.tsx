import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore.ts'
import { useI18n } from '../../i18n/index.ts'
import { DragonSprite } from '../pet/DragonSprite.tsx'
import { PixelSprite } from '../ui/PixelSprite.tsx'
import { PixelButton } from '../ui/PixelButton.tsx'
import { ICONS } from '../../data/icons.ts'

export function Onboarding() {
  const lang = useAppStore((s) => s.lang)
  const pet = useAppStore((s) => s.pet)
  const setLang = useAppStore((s) => s.setLang)
  const finishOnboarding = useAppStore((s) => s.finishOnboarding)
  const { t } = useI18n()
  const [name, setName] = useState(pet.name)

  return (
    <div className="onboarding">
      <div className="onboarding-top">
        <span className="brand">
          <span className="brand-dot" /> Poket<span>Doro</span>
        </span>
        <div className="segmented segmented-sm">
          <button
            type="button"
            className={lang === 'es' ? 'is-active' : ''}
            onClick={() => setLang('es')}
          >
            ES
          </button>
          <button
            type="button"
            className={lang === 'en' ? 'is-active' : ''}
            onClick={() => setLang('en')}
          >
            EN
          </button>
        </div>
      </div>

      <div className="onboarding-hero">
        <span className="onboarding-sun" aria-hidden>
          <PixelSprite rows={ICONS.sun} size={40} />
        </span>
        <span className="onboarding-cloud cloud-1" aria-hidden />
        <span className="onboarding-cloud cloud-2" aria-hidden />
        <span className="onboarding-cloud cloud-3" aria-hidden />
        <div className="onboarding-dragon">
          <DragonSprite mood="happy" stage="hatchling" />
        </div>
      </div>

      <div className="onboarding-card">
        <h1>{t('onboarding.title')}</h1>
        <p className="onboarding-tagline">{t('app.tagline')}</p>

        <ul className="onboarding-points">
          <li>
            <PixelSprite rows={ICONS.egg} size={20} />
            <span>{t('onboarding.p1')}</span>
          </li>
          <li>
            <PixelSprite rows={ICONS.star} size={20} />
            <span>{t('onboarding.p2')}</span>
          </li>
          <li>
            <PixelSprite rows={ICONS.drop} size={20} />
            <span>{t('onboarding.p3')}</span>
          </li>
        </ul>

        <form
          className="onboarding-form"
          onSubmit={(event) => {
            event.preventDefault()
            finishOnboarding(name.trim() || pet.name)
          }}
        >
          <label htmlFor="pet-name">{t('onboarding.nameLabel')}</label>
          <input
            id="pet-name"
            className="pixel-input"
            value={name}
            maxLength={14}
            onChange={(event) => setName(event.target.value)}
            placeholder={t('pet.namePlaceholder')}
            autoComplete="off"
          />
          <PixelButton type="submit" block size="lg">
            {t('onboarding.cta')}
          </PixelButton>
          <p className="onboarding-hint">{t('onboarding.hint')}</p>
        </form>
      </div>
    </div>
  )
}
