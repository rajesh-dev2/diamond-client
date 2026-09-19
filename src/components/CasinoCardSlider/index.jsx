/**
 * CasinoCardSlider
 * ────────────────
 * Horizontal card dealing slider mimicking the Slick Slider dealing matrix from DiamondExch.
 * Renders Row A and Row B with Joker card indicator and dealt card sequence.
 */

import { useRef, useEffect } from 'react'
import './style.css'

export function PlayingCardTile({
  rank = 'A',
  suit = '♠',
  color = 'black',
  isJoker = false,
  isEmpty = false,
  onClick,
}) {
  if (isEmpty) {
    return <div className="playing-card-tile empty-placeholder" />
  }

  const isRed = color === 'red' || suit === '♥' || suit === '♦' || suit === 'H' || suit === 'D'
  const isHeart = suit === '♥' || suit === 'H'
  const isSpade = suit === '♠' || suit === 'S'

  return (
    <div
      className={`playing-card-tile ${isRed ? 'red' : 'black'} ${isJoker ? 'is-joker' : ''}`.trim()}
      onClick={onClick}
      title={isJoker ? `Opening Joker: ${rank}${suit}` : `Card: ${rank}${suit}`}
    >
      {isJoker && <span className="joker-tag">Joker</span>}
      <img src="/img/game-card.png" alt="Card" className="playing-card-img" />
    </div>
  )
}

export default function CasinoCardSlider({
  jokerCard,
  andarCards = [],
  baharCards = [],
  className = '',
}) {
  const andarTrackRef = useRef(null)
  const baharTrackRef = useRef(null)

  // Auto-scroll track to the right whenever a new card is dealt
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

  return (
    <div className={`casino-cards-overlay-box ${className}`.trim()}>
      {/* ── Row A (Andar) ── */}
      <div className="cards-slider-row">
        <span className="row-side-label">A</span>
        <div className="slick-slider slick-initialized">
          <div className="slick-list">
            <div className="slick-track" ref={andarTrackRef}>
              {/* Opening Joker Card (Pinned first in Row A) */}
              {jokerCard && (
                <PlayingCardTile
                  rank={jokerCard.rank}
                  suit={jokerCard.suit}
                  color={jokerCard.color}
                  isJoker={true}
                />
              )}

              {/* Andar Dealt Cards */}
              {andarCards.map((card, idx) => (
                <PlayingCardTile
                  key={`andar-${idx}`}
                  rank={card.rank}
                  suit={card.suit}
                  color={card.color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row B (Bahar) ── */}
      <div className="cards-slider-row">
        <span className="row-side-label">B</span>
        <div className="slick-slider slick-initialized">
          <div className="slick-list">
            <div className="slick-track" ref={baharTrackRef}>
              {/* Empty placeholder for alignment with the Joker card in Row A */}
              {jokerCard && <PlayingCardTile isEmpty={true} />}

              {/* Bahar Dealt Cards */}
              {baharCards.map((card, idx) => (
                <PlayingCardTile
                  key={`bahar-${idx}`}
                  rank={card.rank}
                  suit={card.suit}
                  color={card.color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
