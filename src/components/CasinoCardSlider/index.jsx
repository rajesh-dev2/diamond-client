/**
 * CasinoCardSlider
 * ────────────────
 * Horizontal card dealing slider mimicking DiamondExch Andar Bahar stream overlay:
 *   • ANDAR row: [ < ] [ A♣ ] [ J♠ ] [ 4♠ ] [ > ]
 *   • BAHAR row: [ < ] [ 2♠ ] [ 2♣ ] [ 7♣ ] [ > ]
 */

import { useRef, useEffect } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './style.css'

const SlickSlider = (Slider && Slider.default) ? Slider.default : Slider

export function PlayingCardTile({
  card,
  isJoker = false,
  isEmpty = false,
  onClick,
}) {
  if (isEmpty) {
    return <div className="playing-card-tile empty-placeholder" />
  }

  let rank = ''
  let suit = ''
  let isRed = false
  let img = null

  if (typeof card === 'string') {
    rank = card.slice(0, -1) || card[0]
    suit = card.slice(-1)
    isRed = suit === '♥' || suit === '♦' || suit === 'h' || suit === 'd'
  } else if (card && typeof card === 'object') {
    rank = card.rank || ''
    suit = card.suit || ''
    isRed = card.color === 'red' || suit === '♥' || suit === '♦'
    img = card.img && card.img !== '0.jpg' && !card.img.endsWith('.jpg') ? card.img : null
  } else {
    rank = isJoker ? 'A' : 'J'
    suit = isJoker ? '♣' : '♠'
    isRed = isJoker ? false : false
  }

  return (
    <div
      className={`playing-card-tile ${isRed ? 'text-red' : 'text-black'} ${isJoker ? 'is-joker' : ''}`.trim()}
      onClick={onClick}
    >
      {img ? (
        <img src={img} alt={`${rank}${suit}`} className="playing-card-img" />
      ) : (
        <div className="playing-card-inner-face">
          <div className="card-rank">{rank}</div>
          <div className="card-suit">{suit}</div>
        </div>
      )}
    </div>
  )
}

export default function CasinoCardSlider({
  jokerCard = { rank: 'A', suit: '♣', color: 'black' },
  andarCards = [
    { rank: 'J', suit: '♠', color: 'black' },
    { rank: '4', suit: '♠', color: 'black' },
  ],
  baharCards = [
    { rank: '2', suit: '♠', color: 'black' },
    { rank: '2', suit: '♣', color: 'black' },
    { rank: '7', suit: '♣', color: 'black' },
  ],
  className = '',
}) {
  const andarSliderRef = useRef(null)
  const baharSliderRef = useRef(null)

  // Merge opening joker into Andar row
  const allAndarCards = [
    { ...(typeof jokerCard === 'object' ? jokerCard : { rank: 'A', suit: '♣' }), isJoker: true },
    ...(andarCards || []).map((c) => (typeof c === 'object' ? c : { rank: c, suit: '' })),
  ]

  const allBaharCards = (baharCards || []).map((c) =>
    typeof c === 'object' ? c : { rank: c, suit: '' }
  )

  const slickSettings = {
    dots: false,
    infinite: false,
    speed: 250,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
  }

  // Auto-slide to the right whenever cards change
  useEffect(() => {
    if (andarSliderRef.current && allAndarCards.length > 3) {
      andarSliderRef.current.slickGoTo(allAndarCards.length - 3)
    }
  }, [allAndarCards.length])

  useEffect(() => {
    if (baharSliderRef.current && allBaharCards.length > 3) {
      baharSliderRef.current.slickGoTo(allBaharCards.length - 3)
    }
  }, [allBaharCards.length])

  return (
    <div className={`casino-cards-overlay-box ${className}`.trim()}>
      {/* ── Row 1: ANDAR ── */}
      <div className="cards-slider-group">
        <div className="group-title">ANDAR</div>
        <div className="slider-row-wrapper">
          <button
            type="button"
            className="slider-arrow-btn prev"
            onClick={() => andarSliderRef.current?.slickPrev()}
            aria-label="Previous Andar Card"
          >
            <i className="fa fa-chevron-left" />
          </button>
          <div className="cards-slider-container">
            <SlickSlider ref={andarSliderRef} {...slickSettings}>
              {allAndarCards.map((card, idx) => (
                <div className="card-slide-item" key={`andar-${card.id || idx}`}>
                  <PlayingCardTile card={card} isJoker={card.isJoker} />
                </div>
              ))}
            </SlickSlider>
          </div>
          <button
            type="button"
            className="slider-arrow-btn next"
            onClick={() => andarSliderRef.current?.slickNext()}
            aria-label="Next Andar Card"
          >
            <i className="fa fa-chevron-right" />
          </button>
        </div>
      </div>

      {/* ── Row 2: BAHAR ── */}
      <div className="cards-slider-group">
        <div className="group-title">BAHAR</div>
        <div className="slider-row-wrapper">
          <button
            type="button"
            className="slider-arrow-btn prev"
            onClick={() => baharSliderRef.current?.slickPrev()}
            aria-label="Previous Bahar Card"
          >
            <i className="fa fa-chevron-left" />
          </button>
          <div className="cards-slider-container">
            <SlickSlider ref={baharSliderRef} {...slickSettings}>
              {allBaharCards.map((card, idx) => (
                <div className="card-slide-item" key={`bahar-${card.id || idx}`}>
                  <PlayingCardTile card={card} />
                </div>
              ))}
            </SlickSlider>
          </div>
          <button
            type="button"
            className="slider-arrow-btn next"
            onClick={() => baharSliderRef.current?.slickNext()}
            aria-label="Next Bahar Card"
          >
            <i className="fa fa-chevron-right" />
          </button>
        </div>
      </div>
    </div>
  )
}

