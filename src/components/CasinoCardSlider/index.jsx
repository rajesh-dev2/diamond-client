/**
 * CasinoCardSlider
 * ────────────────
 * Horizontal card dealing slider mimicking DiamondExch Andar Bahar stream overlay:
 *   • ANDAR row with default navigation icons and dealt cards using /img/game-card.png
 *   • BAHAR row with default navigation icons and dealt cards using /img/game-card.png
 */

import { useRef, useEffect } from 'react'
import './style.css'

export function PlayingCardTile({
  isJoker = false,
  isEmpty = false,
  onClick,
}) {
  if (isEmpty) {
    return <div className="playing-card-tile empty-placeholder" />
  }

  return (
    <div
      className={`playing-card-tile ${isJoker ? 'is-joker' : ''}`.trim()}
      onClick={onClick}
    >
      <img
        src="/img/game-card.png"
        alt="Game Card"
        className="playing-card-img"
      />
    </div>
  )
}

export default function CasinoCardSlider({
  jokerCard,
  andarCards = [1, 2],
  baharCards = [1, 2, 3],
  className = '',
}) {
  const andarTrackRef = useRef(null)
  const baharTrackRef = useRef(null)

  // Auto-scroll tracks to the right whenever cards change
  useEffect(() => {
    if (andarTrackRef.current) {
      andarTrackRef.current.scrollLeft = andarTrackRef.current.scrollWidth
    }
  }, [andarCards.length])

  useEffect(() => {
    if (baharTrackRef.current) {
      baharTrackRef.current.scrollLeft = baharTrackRef.current.scrollWidth
    }
  }, [baharCards.length])

  const handleScrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -60, behavior: 'smooth' })
    }
  }

  const handleScrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 60, behavior: 'smooth' })
    }
  }

  return (
    <div className={`casino-cards-overlay-box ${className}`.trim()}>
      {/* ── Row 1: ANDAR ── */}
      <div className="cards-slider-group">
        <div className="group-title">ANDAR</div>
        <div className="slider-row-wrapper">
          <i
            className="fa fa-chevron-left"
            onClick={() => handleScrollLeft(andarTrackRef)}
          />
          <div className="cards-track" ref={andarTrackRef}>
            {/* Opening Joker Card */}
            <PlayingCardTile isJoker={true} />

            {/* Andar Dealt Cards */}
            {(andarCards || []).map((_, idx) => (
              <PlayingCardTile key={`andar-${idx}`} />
            ))}
          </div>
          <i
            className="fa fa-chevron-right"
            onClick={() => handleScrollRight(andarTrackRef)}
          />
        </div>
      </div>

      {/* ── Row 2: BAHAR ── */}
      <div className="cards-slider-group">
        <div className="group-title">BAHAR</div>
        <div className="slider-row-wrapper">
          <i
            className="fa fa-chevron-left"
            onClick={() => handleScrollLeft(baharTrackRef)}
          />
          <div className="cards-track" ref={baharTrackRef}>
            {/* Bahar Dealt Cards */}
            {(baharCards || []).map((_, idx) => (
              <PlayingCardTile key={`bahar-${idx}`} />
            ))}
          </div>
          <i
            className="fa fa-chevron-right"
            onClick={() => handleScrollRight(baharTrackRef)}
          />
        </div>
      </div>
    </div>
  )
}
