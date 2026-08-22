/**
 * Reusable Lucky 7 Casino Component (lucky7, lucky7eu, lucky7eu2)
 * ─────────────────────────────────────────────────────────────
 * Powers:
 *   • Lucky 7 - A (lucky7)
 *   • Lucky 7 - B (lucky7eu)
 *   • Lucky 7 - C (lucky7eu2)
 *
 * Faithfully styled according to standard casino layout reference & screenshots:
 *   • Video Stream + Sound Toggle + Top-Left Dealt Card Overlay
 *   • Countdown FlipClock (seconds timer)
 *   • Betting Tables:
 *       1. Main Market: Low Card (A to 6), Center Card 7, High Card (8 to K)
 *       2. Side Market: Even, Odd, Red Suits (♥ ♦), Black Suits (♠ ♣)
 *       3. 3-Card Groups: (A-2-3), (4-5-6), (8-9-10), (J-Q-K) with mini cards & yellow borders
 *       4. 13 Single Cards: A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K
 *   • Last Results Badges (H / L / T) + Round Detail Modal
 *   • Rules Modal
 *   • CasinoLayout Integration (PlaceBetSidebar, MyBetsSidebar, MobileTabs, PlaceBetModal)
 */

import { useState } from 'react'
import { useParams } from 'react-router-dom'
import CasinoLayout from '../../../components/CasinoLayout'
import FlipClock from '../../../components/FlipClock'
import CommonModal from '../../../components/Modal'
import CasinoLastResults from '../../../components/CasinoLastResults'
import CasinoVideoCards from '../../../components/CasinoVideoCards'
import './style.css'

/* ── Mini Card Component with Yellow Border ───────────────────── */
export function MiniCard({ rank, suits = ['♠', '♥', '♦', '♣'] }) {
  return (
    <div className="lucky7-mini-card">
      <div className="mini-rank">{rank}</div>
      <div className="mini-suits">
        {suits.map((suit, sIdx) => {
          const isRed = suit === '♥' || suit === '♦'
          return (
            <span key={sIdx} className={isRed ? 'suit-red' : 'suit-black'}>
              {suit}
            </span>
          )
        })}
      </div>
    </div>
  )
}

/* ── Default Variant Configurations ──────────────────────────── */
const VARIANT_CONFIGS = {
  lucky7: {
    title: 'LUCKY 7 - A',
    code: 'lucky7',
    streamUrl: '/newmediaplayer/lucky7/4a4fdf0e-91d9-4d5e-a8fe-ab1ac5af3a81?ip=103.198.173.38',
    defaultRoundId: '106260822160750',
  },
  lucky7eu: {
    title: 'LUCKY 7 - B',
    code: 'lucky7eu',
    streamUrl: '/newmediaplayer/lucky7eu/d091e266-408f-450c-ab2d-971a496f04bd?ip=103.198.173.38',
    defaultRoundId: '107260822160752',
  },
  lucky7eu2: {
    title: 'LUCKY 7 - C',
    code: 'lucky7eu2',
    streamUrl: '/newmediaplayer/lucky7eu2/b812f831-508d-423c-9461-8cf5937105cf?ip=103.198.173.38',
    defaultRoundId: '108260822160755',
  },
}

/* ── Market Data ──────────────────────────────────────────────── */
const DEFAULT_MARKET = {
  lowCard:  { name: 'Low Card (A-6)',  odds: '2',    suspended: false },
  highCard: { name: 'High Card (8-K)', odds: '2',    suspended: false },
  even:     { name: 'Even',            odds: '2.1',  suspended: false },
  odd:      { name: 'Odd',             odds: '1.79', suspended: false },
  redSuit:  { name: 'Red Suits (♥ ♦)', odds: '1.95', suspended: false },
  blackSuit:{ name: 'Black Suits (♠ ♣)', odds: '1.95', suspended: false },
  groups: [
    { id: 'g1', name: 'A-2-3 Group',   odds: '4', cards: ['A', '2', '3'], suspended: false },
    { id: 'g2', name: '4-5-6 Group',   odds: '4', cards: ['4', '5', '6'], suspended: false },
    { id: 'g3', name: '8-9-10 Group',  odds: '4', cards: ['8', '9', '10'], suspended: false },
    { id: 'g4', name: 'J-Q-K Group',   odds: '4', cards: ['J', 'Q', 'K'], suspended: false },
  ],
  singles: [
    { rank: 'A',  odds: '12', suspended: false },
    { rank: '2',  odds: '12', suspended: false },
    { rank: '3',  odds: '12', suspended: false },
    { rank: '4',  odds: '12', suspended: false },
    { rank: '5',  odds: '12', suspended: false },
    { rank: '6',  odds: '12', suspended: false },
    { rank: '7',  odds: '12', suspended: false },
    { rank: '8',  odds: '12', suspended: false },
    { rank: '9',  odds: '12', suspended: false },
    { rank: '10', odds: '12', suspended: false },
    { rank: 'J',  odds: '12', suspended: false },
    { rank: 'Q',  odds: '12', suspended: false },
    { rank: 'K',  odds: '12', suspended: false },
  ],
}

/* ── Last 10 Results ─────────────────────────────────────────── */
const LAST_RESULTS = [
  { id: 1,  winner: 'H', card: '10♠', result: 'High', roundId: '107260822160751' },
  { id: 2,  winner: 'H', card: 'K♥',  result: 'High', roundId: '107260822160750' },
  { id: 3,  winner: 'H', card: '8♦',  result: 'High', roundId: '107260822160749' },
  { id: 4,  winner: 'H', card: 'J♣',  result: 'High', roundId: '107260822160748' },
  { id: 5,  winner: 'H', card: '9♠',  result: 'High', roundId: '107260822160747' },
  { id: 6,  winner: 'H', card: 'Q♦',  result: 'High', roundId: '107260822160746' },
  { id: 7,  winner: 'L', card: '4♥',  result: 'Low',  roundId: '107260822160745' },
  { id: 8,  winner: 'L', card: '2♣',  result: 'Low',  roundId: '107260822160744' },
  { id: 9,  winner: 'H', card: '9♥',  result: 'High', roundId: '107260822160743' },
  { id: 10, winner: 'L', card: '5♠',  result: 'Low',  roundId: '107260822160742' },
]

export default function Lucky7({ variant = 'lucky7eu' }) {
  const { gameId } = useParams()
  const activeKey = (gameId && VARIANT_CONFIGS[gameId]) ? gameId : (VARIANT_CONFIGS[variant] ? variant : 'lucky7eu')
  const config = VARIANT_CONFIGS[activeKey] || VARIANT_CONFIGS.lucky7eu

  const [showRules, setShowRules] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)
  const [isMuted, setIsMuted] = useState(true)
  const [roundId] = useState(config.defaultRoundId)
  const [market] = useState(DEFAULT_MARKET)
  const [dealtCard] = useState({ rank: '7', suit: '♠', flipped: false })

  return (
    <CasinoLayout
      title={config.title}
      roundId={roundId}
      rulesLink="#rules"
      onRulesClick={() => setShowRules(true)}
    >
      {({ onOddClick }) => {
        const handleBetClick = (runnerName, odds, type = 'back', isSuspended = false) => {
          if (isSuspended || !odds || Number(odds) <= 0) return
          onOddClick({ name: runnerName, [type]: odds }, type)
        }

        return (
          <div className="casino-page-container lucky7-page">
            {/* ── Video Stream Section ── */}
            <div className="casino-video">
              {/* Sound Toggle */}
              <button
                type="button"
                className="sound-toggle-btn"
                onClick={() => setIsMuted((prev) => !prev)}
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                aria-label="Sound Toggle"
              >
                {isMuted ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>

              {/* Video Box / Live Stream */}
              <div className="video-box-container">
                <div className="casino-video-box">
                  <iframe
                    src={`${config.streamUrl}&muted=${isMuted ? 1 : 0}`}
                    title={`${config.title} Live Stream`}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Dealt Card Overlay (Top-Left) */}
              <CasinoVideoCards className="lucky7-dealt-card-overlay">
                <div className="lucky7-single-card-box card-back">
                  {dealtCard.flipped ? (
                    <div style={{ fontWeight: 900, color: '#0f172a' }}>{dealtCard.rank}</div>
                  ) : null}
                </div>
              </CasinoVideoCards>

              {/* Countdown FlipClock Timer (Bottom-Right) */}
              <div className="clock">
                <FlipClock seconds={20} />
              </div>
            </div>

            {/* ── Casino Detail Section ── */}
            <div className="casino-detail">
              {/* ── Row 1: Low Card, Center 7, High Card ── */}
              <div className="lucky7-row-main">
                {/* Low Card */}
                <div
                  className={`lucky7-bet-box ${market.lowCard.suspended ? 'suspended-box' : ''}`}
                  onClick={() => handleBetClick('Low Card', market.lowCard.odds, 'back', market.lowCard.suspended)}
                >
                  <div className="lucky7-odds-top">{market.lowCard.suspended ? '0' : market.lowCard.odds}</div>
                  <div className="lucky7-btn-main">Low Card</div>
                </div>

                {/* Center 7 Card Indicator */}
                <div className="lucky7-center-card-badge">
                  <div className="card-num">7</div>
                  <div className="card-suits">
                    <span className="suit-black">♠</span>
                    <span className="suit-red">♥</span>
                    <span className="suit-black">♣</span>
                    <span className="suit-red">♦</span>
                  </div>
                </div>

                {/* High Card */}
                <div
                  className={`lucky7-bet-box ${market.highCard.suspended ? 'suspended-box' : ''}`}
                  onClick={() => handleBetClick('High Card', market.highCard.odds, 'back', market.highCard.suspended)}
                >
                  <div className="lucky7-odds-top">{market.highCard.suspended ? '0' : market.highCard.odds}</div>
                  <div className="lucky7-btn-main">High Card</div>
                </div>
              </div>

              {/* ── Row 2: Even / Odd & Red / Black Suits ── */}
              <div className="lucky7-row-side">
                {/* Even / Odd */}
                <div className="lucky7-side-group">
                  <div
                    className={`lucky7-bet-box ${market.even.suspended ? 'suspended-box' : ''}`}
                    onClick={() => handleBetClick('Even', market.even.odds, 'back', market.even.suspended)}
                  >
                    <div className="lucky7-odds-top">{market.even.suspended ? '0' : market.even.odds}</div>
                    <div className="lucky7-btn-main">Even</div>
                  </div>
                  <div
                    className={`lucky7-bet-box ${market.odd.suspended ? 'suspended-box' : ''}`}
                    onClick={() => handleBetClick('Odd', market.odd.odds, 'back', market.odd.suspended)}
                  >
                    <div className="lucky7-odds-top">{market.odd.suspended ? '0' : market.odd.odds}</div>
                    <div className="lucky7-btn-main">Odd</div>
                  </div>
                </div>

                {/* Red / Black Suits */}
                <div className="lucky7-side-group">
                  <div
                    className={`lucky7-bet-box ${market.redSuit.suspended ? 'suspended-box' : ''}`}
                    onClick={() => handleBetClick('Red Suits', market.redSuit.odds, 'back', market.redSuit.suspended)}
                  >
                    <div className="lucky7-odds-top">{market.redSuit.suspended ? '0' : market.redSuit.odds}</div>
                    <div className="lucky7-btn-main lucky7-suits-btn">
                      <span className="suit-red">♥</span>
                      <span className="suit-red">♦</span>
                    </div>
                  </div>
                  <div
                    className={`lucky7-bet-box ${market.blackSuit.suspended ? 'suspended-box' : ''}`}
                    onClick={() => handleBetClick('Black Suits', market.blackSuit.odds, 'back', market.blackSuit.suspended)}
                  >
                    <div className="lucky7-odds-top">{market.blackSuit.suspended ? '0' : market.blackSuit.odds}</div>
                    <div className="lucky7-btn-main lucky7-suits-btn">
                      <span className="suit-black">♠</span>
                      <span className="suit-black">♣</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Row 3: 3-Card Groups (A-2-3, 4-5-6, 8-9-10, J-Q-K) ── */}
              <div className="lucky7-row-groups">
                {market.groups.map((grp) => (
                  <div
                    key={grp.id}
                    className={`lucky7-bet-box ${grp.suspended ? 'suspended-box' : ''}`}
                    onClick={() => handleBetClick(grp.name, grp.odds, 'back', grp.suspended)}
                  >
                    <div className="lucky7-odds-top">{grp.suspended ? '0' : grp.odds}</div>
                    <div className="lucky7-group-cards-btn">
                      {grp.cards.map((cardRank, cIdx) => (
                        <MiniCard key={cIdx} rank={cardRank} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Row 4: 13 Single Cards Grid (A to K) ── */}
              <div className="lucky7-row-singles">
                {market.singles.map((single, sIdx) => (
                  <div
                    key={`single-${sIdx}`}
                    className={`lucky7-single-card-item ${single.suspended ? 'suspended-box' : ''}`}
                    onClick={() => handleBetClick(`Card ${single.rank}`, single.odds, 'back', single.suspended)}
                  >
                    <div className="lucky7-single-odds-top">{single.suspended ? '0' : single.odds}</div>
                    <MiniCard rank={single.rank} />
                  </div>
                ))}
              </div>

              {/* ── Row 5: Last Results ── */}
              <CasinoLastResults
                title="Last Result"
                viewAllLink={`/casino-results/${activeKey}`}
                results={LAST_RESULTS}
                renderResult={(res, idx) => (
                  <span
                    key={res.id || idx}
                    className="result result-b"
                    onClick={() => setSelectedResult(res)}
                    title={`Round: ${res.roundId} | Card: ${res.card} (${res.result})`}
                  >
                    {res.winner}
                  </span>
                )}
              />
            </div>

            {/* ── Rules Modal ── */}
            {showRules && (
              <CommonModal
                show={showRules}
                onClose={() => setShowRules(false)}
                title={`${config.title} — Game Rules`}
                position="center"
                showFooter={true}
              >
                <div style={{ padding: '14px', lineHeight: 1.6, fontSize: '13px', color: '#334155' }}>
                  <h6 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Game Concept</h6>
                  <p>
                    <strong>Lucky 7</strong> is a fast-paced card game where one standard 52-card deck is used.
                    A single card is drawn each round, and players bet on whether the card will be <strong>Below 7 (Low Card)</strong>, <strong>Above 7 (High Card)</strong>, or exactly <strong>7</strong>.
                  </p>

                  <h6 style={{ fontWeight: 800, color: '#0f172a', marginTop: '12px', marginBottom: '8px' }}>Betting Markets</h6>
                  <ul style={{ paddingLeft: '20px', marginBottom: '10px' }}>
                    <li><strong>Low Card (A, 2, 3, 4, 5, 6):</strong> Pays 2.00 (or 50% if card is 7 depending on table rules)</li>
                    <li><strong>High Card (8, 9, 10, J, Q, K):</strong> Pays 2.00</li>
                    <li><strong>Exact 7:</strong> Pays 12.00</li>
                    <li><strong>Even / Odd:</strong> Bet on whether the card’s numerical value is Even or Odd (Ace = 1, J=11, Q=12, K=13)</li>
                    <li><strong>Color / Suits:</strong> Red (♥ ♦) or Black (♠ ♣)</li>
                    <li><strong>3-Card Groups:</strong> Bet on (A-2-3), (4-5-6), (8-9-10), or (J-Q-K) paying 4.00</li>
                    <li><strong>Individual Card Value:</strong> Exact card face prediction paying 12.00</li>
                  </ul>
                </div>
              </CommonModal>
            )}

            {/* ── Round Result Details Modal ── */}
            {selectedResult && (
              <CommonModal
                show={Boolean(selectedResult)}
                onClose={() => setSelectedResult(null)}
                title="Round Result Details"
                position="center"
                showFooter={true}
              >
                <div className="lucky7-result-modal">
                  <div className="lucky7-result-round-header">
                    <span>Round ID: <strong>{selectedResult.roundId}</strong></span>
                    <span className="lucky7-result-winner-badge">
                      Result: {selectedResult.result} ({selectedResult.winner})
                    </span>
                  </div>
                  <div className="lucky7-result-details-grid">
                    <div className="lucky7-detail-item">
                      <span>Dealt Card:</span>
                      <strong>{selectedResult.card}</strong>
                    </div>
                    <div className="lucky7-detail-item">
                      <span>Outcome:</span>
                      <strong>{selectedResult.result} Card</strong>
                    </div>
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
