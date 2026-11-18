import { useState } from 'react'
import { useAppStore } from '../store/useAppStore.ts'
import { useI18n } from '../i18n/index.ts'
import { useNow } from '../hooks/useNow.ts'
import { usePetMood } from '../hooks/usePetMood.ts'
import { levelInfo, stageForXp, STAGE_LEVELS } from '../lib/levels.ts'
import { pickDialogue } from '../data/dialogue.ts'
import { playChime } from '../lib/audio.ts'
import { ICONS } from '../data/icons.ts'
import { PetScene } from '../components/pet/PetScene.tsx'
import { PixelBar } from '../components/ui/PixelBar.tsx'
import { PixelButton } from '../components/ui/PixelButton.tsx'
import { PixelSprite } from '../components/ui/PixelSprite.tsx'
import { Icon } from '../components/ui/Icon.tsx'
import { Modal } from '../components/ui/Modal.tsx'

const FEED_COST = 10
const MEDICINE_COST = 25
const PET_COOLDOWN_MS = 60_000

export function PetScreen() {
  const pet = useAppStore((s) => s.pet)
  const coins = useAppStore((s) => s.stats.coins)
  const sound = useAppStore((s) => s.settings.sound)
  const feedPet = useAppStore((s) => s.feedPet)
  const healPet = useAppStore((s) => s.healPet)
  const petPet = useAppStore((s) => s.petPet)
  const renamePet = useAppStore((s) => s.renamePet)
  const { t, lang } = useI18n()
  const mood = usePetMood()
  const now = useNow(2000)
  const [renaming, setRenaming] = useState(false)
  const [name, setName] = useState(pet.name)

  const level = levelInfo(pet.xp)
  const stage = stageForXp(pet.xp)
  const nextStage =
    stage === 'hatchling' ? 'drake' : stage === 'drake' ? 'emberwing' : null
  const cooldown = Math.max(
    0,
    Math.ceil((PET_COOLDOWN_MS - (now - pet.lastPettedAt)) / 1000),
  )

  const dialogue = pickDialogue(
    mood,
    lang,
    Math.floor(now / 30_000) + pet.xp,
    pet.name,
  )

  const care = (action: () => void) => {
    action()
    if (sound) playChime('click')
  }

  return (
    <div className="screen screen-pet">
      <header className="screen-head">
        <div>
          <span className="eyebrow">{t('pet.title')}</span>
          <h1 className="pet-name">
            {pet.name}
            <button
              type="button"
              className="icon-btn icon-btn-sm"
              onClick={() => {
                setName(pet.name)
                setRenaming(true)
              }}
              aria-label={t('pet.rename')}
            >
              <Icon name="edit" size={15} />
            </button>
          </h1>
        </div>
        <span className="stage-chip">{t(`pet.stage.${stage}`)}</span>
      </header>

      <PetScene mood={mood} stage={stage} dialogue={dialogue} tone={mood === 'sleeping' ? 'night' : 'day'} />

      {pet.sick ? (
        <div className="sick-banner">
          <PixelSprite rows={ICONS.drop} size={22} />
          <div>
            <strong>{t('pet.sick')}</strong>
            <small>{t('pet.sickHint')}</small>
          </div>
        </div>
      ) : null}

      <section className="card pet-stats">
        <div className="xp-row">
          <span className="xp-level">
            {t('pet.level', { level: level.level })}
          </span>
          <span className="xp-amount">
            {t('pet.xpToNext', { xp: level.intoLevel, need: level.needed })}
          </span>
        </div>
        <span className="xp-track">
          <span
            className="xp-fill"
            style={{ width: `${Math.round(level.progress * 100)}%` }}
          />
        </span>

        <div className="statbars">
          <PixelBar
            label={t('pet.health')}
            value={pet.health}
            color="#E15B4E"
            iconRows={ICONS.heart}
            hint={t('pet.healthHint')}
          />
          <PixelBar
            label={t('pet.food')}
            value={pet.hunger}
            color="#F5A33C"
            iconRows={ICONS.apple}
            hint={t('pet.foodHint')}
          />
          <PixelBar
            label={t('pet.happiness')}
            value={pet.happiness}
            color="#F58FA3"
            iconRows={ICONS.star}
            hint={t('pet.happinessHint')}
          />
          <PixelBar
            label={t('pet.energy')}
            value={pet.energy}
            color="#4FC96E"
            iconRows={ICONS.bolt}
            hint={t('pet.energyHint')}
          />
        </div>
      </section>

      <section className="card care-card">
        <div className="card-head">
          <h2>{t('pet.care')}</h2>
          <span className="coin-chip">
            <PixelSprite rows={ICONS.coin} size={14} />
            {coins}
          </span>
        </div>
        <div className="care-grid">
          <PixelButton
            variant="secondary"
            block
            icon={<PixelSprite rows={ICONS.apple} size={17} />}
            onClick={() => care(feedPet)}
          >
            {t('pet.feed', { coins: FEED_COST })}
          </PixelButton>
          <PixelButton
            variant="secondary"
            block
            icon={<PixelSprite rows={ICONS.med} size={17} />}
            onClick={() => care(healPet)}
          >
            {t('pet.medicine', { coins: MEDICINE_COST })}
          </PixelButton>
          <PixelButton
            variant="ghost"
            block
            disabled={cooldown > 0}
            icon={<PixelSprite rows={ICONS.paw} size={17} />}
            onClick={() => care(petPet)}
          >
            {cooldown > 0
              ? t('pet.pettedCooldown', { sec: cooldown })
              : t('pet.pet')}
          </PixelButton>
        </div>
        <p className="card-note">{t('pet.careHint')}</p>
      </section>

      <section className="card evolution-card">
        <div className="card-head">
          <h2>{t('pet.evolution')}</h2>
          <PixelSprite rows={ICONS.crown} size={18} />
        </div>
        <div className="evolution-track">
          {(['hatchling', 'drake', 'emberwing'] as const).map((item) => {
            const reached = level.level >= STAGE_LEVELS[item]
            return (
              <span
                key={item}
                className={`evo-step${reached ? ' is-reached' : ''}${
                  item === stage ? ' is-current' : ''
                }`}
              >
                {reached ? (
                  <Icon name="check" size={13} />
                ) : (
                  <Icon name="lock" size={13} />
                )}
                {t(`pet.stage.${item}`)}
              </span>
            )
          })}
        </div>
        <p className="card-note">
          {nextStage
            ? t('pet.evolutionHint', {
                level: STAGE_LEVELS[nextStage],
                stage: t(`pet.stage.${nextStage}`),
              })
            : t('pet.maxStage')}
        </p>
      </section>

      <p className="soft-note">
        <PixelSprite rows={ICONS.moon} size={14} /> {t('pet.offlineNote')}
      </p>

      <Modal
        open={renaming}
        onClose={() => setRenaming(false)}
        title={t('pet.rename')}
      >
        <form
          className="rename-form"
          onSubmit={(event) => {
            event.preventDefault()
            const trimmed = name.trim()
            if (!trimmed) return
            renamePet(trimmed)
            setRenaming(false)
          }}
        >
          <input
            className="pixel-input"
            value={name}
            maxLength={14}
            onChange={(event) => setName(event.target.value)}
            placeholder={t('pet.namePlaceholder')}
            autoComplete="off"
            autoFocus
          />
          <div className="modal-actions">
            <PixelButton
              variant="ghost"
              onClick={() => setRenaming(false)}
            >
              {t('common.cancel')}
            </PixelButton>
            <PixelButton type="submit">{t('common.save')}</PixelButton>
          </div>
        </form>
      </Modal>
    </div>
  )
}
