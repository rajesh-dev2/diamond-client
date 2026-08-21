/**
 * V VIP Teenpatti 1-day (teen62)
 * ─────────────────────────────
 * Live casino Teenpatti 1-day page matching reference HTML and styling:
 *   • Video Stream + Video Cards Overlay (Player A & Player B 3-card hands)
 *   • Countdown FlipClock (seconds timer)
 *   • Casino Table:
 *       - Player A (Main, Consecutive - Back & Lay)
 *       - Player B (Main, Consecutive - Back & Lay)
 *       - Card 1 to 6 Odd & Even markets
 *   • Casino Last Results (A / B badges + Result dialog)
 *   • Full integration with CasinoLayout (Sidebar bet slip, MobileTabs, PlaceBetModal, Rules modal)
 */

import { useState } from 'react'
import CasinoLayout from '../../../components/CasinoLayout'
import FlipClock from '../../../components/FlipClock'
import RulesModal from '../../../components/RulesModal'
import CommonModal from '../../../components/Modal'
import CasinoLastResults from '../../../components/CasinoLastResults'
import CasinoVideoCards from '../../../components/CasinoVideoCards'
import './style.css'

const INITIAL_MARKET = {
  playerA: {
    name: 'Player A',
    main: { back: 0, lay: 0, suspended: true },
    consecutive: { back: 0, lay: 0, suspended: true },
  },
  playerB: {
    name: 'Player B',
    main: { back: 0, lay: 0, suspended: true },
    consecutive: { back: 0, lay: 0, suspended: true },
  },
  cardOdds: [
    { card: 'Card 1', odd: 0, even: 0, suspendedOdd: true, suspendedEven: true },
    { card: 'Card 2', odd: 0, even: 0, suspendedOdd: true, suspendedEven: true },
    { card: 'Card 3', odd: 0, even: 0, suspendedOdd: true, suspendedEven: true },
    { card: 'Card 4', odd: 0, even: 0, suspendedOdd: true, suspendedEven: true },
    { card: 'Card 5', odd: 0, even: 0, suspendedOdd: true, suspendedEven: true },
    { card: 'Card 6', odd: 1.78, even: 2.2, suspendedOdd: true, suspendedEven: true },
  ],
}

/* ── Live Cards Data (Player A: 8♣, 6♥, 4♠ | Player B: 3♥, A♣, 7♠) ── */
const INITIAL_CARDS_A = [
  { rank: '8', suit: '♣', color: 'black', img: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/8C.png', flipped: true },
  { rank: '6', suit: '♥', color: 'red',   img: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/6H.png', flipped: true },
  { rank: '4', suit: '♠', color: 'black', img: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/4S.png', flipped: true },
]

const INITIAL_CARDS_B = [
  { rank: '3', suit: '♥', color: 'red',   img: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/3H.png', flipped: true },
  { rank: 'A', suit: '♣', color: 'black', img: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/1C.png', flipped: true },
  { rank: '7', suit: '♠', color: 'black', img: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/7S.png', flipped: true },
]

/* ── Last 10 Results (B, A, B, B, A, B, A, A, A, B) ───────── */
const LAST_RESULTS = [
  { id: 1, winner: 'B', roundId: '195260820124236', scoreA: 'Pair', scoreB: 'Flush' },
  { id: 2, winner: 'A', roundId: '195260820124235', scoreA: 'High Card', scoreB: 'Pair' },
  { id: 3, winner: 'B', roundId: '195260820124234', scoreA: 'High Card', scoreB: 'Straight' },
  { id: 4, winner: 'B', roundId: '195260820124233', scoreA: 'High Card', scoreB: 'Pair' },
  { id: 5, winner: 'A', roundId: '195260820124232', scoreA: 'Pair', scoreB: 'Trio' },
  { id: 6, winner: 'B', roundId: '195260820124231', scoreA: 'Flush', scoreB: 'Pair' },
  { id: 7, winner: 'A', roundId: '195260820124230', scoreA: 'High Card', scoreB: 'Flush' },
  { id: 8, winner: 'A', roundId: '195260820124229', scoreA: 'Straight', scoreB: 'Pair' },
  { id: 9, winner: 'A', roundId: '195260820124228', scoreA: 'Pair', scoreB: 'High Card' },
  { id: 10, winner: 'B', roundId: '195260820124227', scoreA: 'High Card', scoreB: 'Pair' },
]

/* ── Card Component with Graceful Fallback & Flip Animation ─── */
function FlipPlayingCard({ card }) {
  const [isFlipped, setIsFlipped] = useState(card?.flipped ?? true)
  const [imgError, setImgError] = useState(false)

  return (
    <div 
      className={`flip-card ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped((prev) => !prev)}
      title="Click to flip card"
    >
      <div className="flip-card-inner">
        {/* Back side of card (shown when unflipped) */}
        <div className="flip-card-front">
          <img 
            src="https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/1.jpg" 
            alt="Card Back"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.parentElement.classList.add('playing-card-back-pattern')
            }}
          />
        </div>

        {/* Front side of card (face value) */}
        <div className="flip-card-back">
          {!imgError && card.img ? (
            <img 
              src={card.img} 
              alt={`${card.rank}${card.suit}`}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={`playing-card-face ${card.color}`}>
              <div className="card-corner">
                <span className="card-rank">{card.rank}</span>
                <span className="card-suit">{card.suit}</span>
              </div>
              <div className="card-center">{card.suit}</div>
              <div className="card-corner" style={{ transform: 'rotate(180deg)' }}>
                <span className="card-rank">{card.rank}</span>
                <span className="card-suit">{card.suit}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Teenpatti1Day() {
  const [showRules, setShowRules] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)
  const [roundId] = useState('195260820124237')
  const [cardsA] = useState(INITIAL_CARDS_A)
  const [cardsB] = useState(INITIAL_CARDS_B)
  const [market] = useState(INITIAL_MARKET)

  return (
    <CasinoLayout
      title="V VIP TEENPATTI 1-DAY"
      roundId={roundId}
      rulesLink="#rules"
      onRulesClick={() => setShowRules(true)}
    >
      {({ onOddClick }) => {
        // Handler for placing a bet through odds box click
        const handleBetClick = (runnerName, odds, type, isSuspended) => {
          if (isSuspended || !odds || odds <= 0) return
          onOddClick({ name: runnerName, [type]: odds }, type)
        }

        return (
          <div className="casino-page-container teenpatti1day">
            {/* ── Video Stream Section ── */}
            <div className="casino-video">
              {/* ── Video Cards Overlay (Player A & Player B) ── */}
              <CasinoVideoCards />

              <div className="video-box-container">
                <div className="casino-video-box">
                  <iframe
                    src="/newmediaplayer/teen62/d0c59ba3-8958-4805-9479-2df56764a5cb?ip=103.198.173.38"
                    title="V VIP Teenpatti 1-day Stream"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* ── Countdown Timer (Bottom Right) ── */}
              <div className="clock">
                <FlipClock seconds={21} />
              </div>
            </div>

            {/* ── Casino Detail Section ── */}
            <div className="casino-detail">
              <div className="casino-table">
                {/* ── Player A & Player B Box ── */}
                <div className="casino-table-box">
                  {/* Left Box: Player A */}
                  <div className="casino-table-left-box">
                    <div className="casino-table-header">
                      <div className="casino-nation-detail">Player A</div>
                      <div className="casino-odds-box back">Back</div>
                      <div className="casino-odds-box lay">Lay</div>
                    </div>
                    <div className="casino-table-body">
                      {/* Player A Main */}
                      <div className="casino-table-row">
                        <div className="casino-nation-detail">
                          <div className="casino-nation-name">Main</div>
                        </div>
                        <div className={`casino-odds-box-wrapper ${market.playerA.main.suspended || market.playerA.main.suspendedLay ? 'suspended-box' : ''}`}>
                          <div 
                            className="casino-odds-box back"
                            onClick={() => handleBetClick('Player A Main', market.playerA.main.back, 'back', false)}
                          >
                            <span className="casino-odds">{market.playerA.main.back}</span>
                          </div>
                          <div 
                            className="casino-odds-box lay"
                            onClick={() => handleBetClick('Player A Main', market.playerA.main.lay, 'lay', market.playerA.main.suspendedLay)}
                          >
                            <span className="casino-odds">{market.playerA.main.lay || '-'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Player A Consecutive */}
                      <div className="casino-table-row">
                        <div className="casino-nation-detail">
                          <div className="casino-nation-name">Consecutive</div>
                        </div>
                        <div className={`casino-odds-box-wrapper ${market.playerA.consecutive.suspended ? 'suspended-box' : ''}`}>
                          <div 
                            className="casino-odds-box back"
                            onClick={() => handleBetClick('Player A Consecutive', market.playerA.consecutive.back, 'back', false)}
                          >
                            <span className="casino-odds">{market.playerA.consecutive.back}</span>
                          </div>
                          <div 
                            className="casino-odds-box lay"
                            onClick={() => handleBetClick('Player A Consecutive', market.playerA.consecutive.lay, 'lay', false)}
                          >
                            <span className="casino-odds">{market.playerA.consecutive.lay}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="casino-table-box-divider" />

                  {/* Right Box: Player B */}
                  <div className="casino-table-right-box">
                    <div className="casino-table-header">
                      <div className="casino-nation-detail">Player B</div>
                      <div className="casino-odds-box back">Back</div>
                      <div className="casino-odds-box lay">Lay</div>
                    </div>
                    <div className="casino-table-body">
                      {/* Player B Main */}
                      <div className="casino-table-row">
                        <div className="casino-nation-detail">
                          <div className="casino-nation-name">Main</div>
                        </div>
                        <div className={`casino-odds-box-wrapper ${market.playerB.main.suspended || market.playerB.main.suspendedLay ? 'suspended-box' : ''}`}>
                          <div 
                            className="casino-odds-box back"
                            onClick={() => handleBetClick('Player B Main', market.playerB.main.back, 'back', false)}
                          >
                            <span className="casino-odds">{market.playerB.main.back}</span>
                          </div>
                          <div 
                            className="casino-odds-box lay"
                            onClick={() => handleBetClick('Player B Main', market.playerB.main.lay, 'lay', market.playerB.main.suspendedLay)}
                          >
                            <span className="casino-odds">{market.playerB.main.lay || '-'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Player B Consecutive */}
                      <div className="casino-table-row">
                        <div className="casino-nation-detail">
                          <div className="casino-nation-name">Consecutive</div>
                        </div>
                        <div className={`casino-odds-box-wrapper ${market.playerB.consecutive.suspended ? 'suspended-box' : ''}`}>
                          <div 
                            className="casino-odds-box back"
                            onClick={() => handleBetClick('Player B Consecutive', market.playerB.consecutive.back, 'back', false)}
                          >
                            <span className="casino-odds">{market.playerB.consecutive.back}</span>
                          </div>
                          <div 
                            className="casino-odds-box lay"
                            onClick={() => handleBetClick('Player B Consecutive', market.playerB.consecutive.lay, 'lay', false)}
                          >
                            <span className="casino-odds">{market.playerB.consecutive.lay}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Full Width Table (Card 1 to Card 6 Odd / Even) ── */}
                <div className="casino-table-full-box teenpatti1day-other-odds mt-3">
                  <div className="casino-table-header">
                    <div className="casino-nation-detail" />
                    {market.cardOdds.map((item, idx) => (
                      <div key={`header-${idx}`} className="casino-odds-box">{item.card}</div>
                    ))}
                  </div>

                  <div className="casino-table-body">
                    {/* Odd Row */}
                    <div className="casino-table-row">
                      <div className="casino-nation-detail">
                        <div className="casino-nation-name">Odd</div>
                      </div>
                      {market.cardOdds.map((item, idx) => (
                        <div
                          key={`odd-${idx}`}
                          className={`casino-odds-box back ${item.suspendedOdd ? 'suspended-box' : ''}`}
                          onClick={() => handleBetClick(`${item.card} Odd`, item.odd, 'back', item.suspendedOdd)}
                        >
                          <span className="casino-odds">{item.odd}</span>
                        </div>
                      ))}
                    </div>

                    {/* Even Row */}
                    <div className="casino-table-row">
                      <div className="casino-nation-detail">
                        <div className="casino-nation-name">Even</div>
                      </div>
                      {market.cardOdds.map((item, idx) => (
                        <div
                          key={`even-${idx}`}
                          className={`casino-odds-box back ${item.suspendedEven ? 'suspended-box' : ''}`}
                          onClick={() => handleBetClick(`${item.card} Even`, item.even, 'back', item.suspendedEven)}
                        >
                          <span className="casino-odds">{item.even}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Last Results ── */}
              <CasinoLastResults
                results={LAST_RESULTS}
                viewAllLink="/casino-results/teen62"
                onResultClick={(res) => setSelectedResult(res)}
              />
            </div>

            {/* ── Rules Modal ── */}
            <RulesModal show={showRules} onHide={() => setShowRules(false)} />

            {/* ── Result Quick Detail Modal ── */}
            {selectedResult && (
              <CommonModal
                show={Boolean(selectedResult)}
                onClose={() => setSelectedResult(null)}
                title="Round Result Details"
                position="center"
                showFooter={true}
              >
                <div className="teen62-result-modal">
                  <div className="teen62-result-round-header">
                    <span>Round ID: {selectedResult.roundId}</span>
                    <span className={`teen62-result-winner winner-${selectedResult.winner.toLowerCase()}`}>
                      Winner: Player {selectedResult.winner}
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="mb-1"><strong>Player A Hand:</strong> {selectedResult.scoreA}</p>
                    <p className="mb-0"><strong>Player B Hand:</strong> {selectedResult.scoreB}</p>
                  </div>
                </div>
              </CommonModal>
            )}
          </div>
        )
      }}
    </CasinoLayout>
  )
}
