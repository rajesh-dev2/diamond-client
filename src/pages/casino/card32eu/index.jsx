/**
 * 32 Cards B (card32eu / cards32b)
 * ────────────────────────────────
 * Live casino 32 Cards B page matching reference HTML, DOM structure and screenshot:
 *   • Video Stream + Sound Toggle + Video Cards Overlay (Player 8, 9, 10, 11 with points and flip cards)
 *   • Countdown FlipClock (seconds timer)
 *   • Casino Tables:
 *       1. Main Table:
 *          - Left: Player 8, 9, 10, 11 (Back / Lay)
 *          - Right: Player 8, 9, 10, 11 (Odd / Even)
 *       2. Color & Total Table:
 *          - Left: Any 3 Card Black, Any 3 Card Red, Two Black Two Red
 *          - Right: 8 & 9 Total, 10 & 11 Total
 *       3. Numbers Box:
 *          - Digits 1, 2, 3, 4, 5, 6, 7, 8, 9, 0
 *   • Casino Last Results (Green circular pills 8, 11, 10, 8... + Result detail modal)
 *   • Full integration with CasinoLayout (Sidebar bet slip, MobileTabs, PlaceBetModal)
 */

import { useState } from 'react'
import CasinoLayout from '../../../components/CasinoLayout'
import FlipClock from '../../../components/FlipClock'
import CommonModal from '../../../components/Modal'
import CasinoLastResults from '../../../components/CasinoLastResults'
import CasinoVideoCards from '../../../components/CasinoVideoCards'
import CasinoDualTable from '../../../components/CasinoDualTable'
import CasinoNumbersGrid from '../../../components/CasinoNumbersGrid'
import './style.css'

/* ── Main Market Odds Data ────────────────────────────────────── */
const MAIN_PLAYERS = [
  { id: 'p8',  name: 'Player 8',  back: 12.2, lay: 13.7, odd: 1.97, even: 1.97, suspended: false },
  { id: 'p9',  name: 'Player 9',  back: 5.95, lay: 6.45, odd: 1.97, even: 1.97, suspended: false },
  { id: 'p10', name: 'Player 10', back: 3.20, lay: 3.45, odd: 1.97, even: 1.97, suspended: false },
  { id: 'p11', name: 'Player 11', back: 2.08, lay: 2.18, odd: 1.97, even: 1.97, suspended: false },
]

/* ── Color Combinations Market ────────────────────────────────── */
const COLOR_MARKET = [
  { id: 'c_3b', name: 'Any 3 Card Black',  back: 3.25, lay: 3.45, suspended: false },
  { id: 'c_3r', name: 'Any 3 Card Red',    back: 3.25, lay: 3.45, suspended: false },
  { id: 'c_2b2r', name: 'Two Black Two Red', back: 2.44, lay: 2.54, suspended: false },
]

/* ── Totals Market ────────────────────────────────────────────── */
const TOTAL_MARKET = [
  { id: 'tot_8_9',   name: '8 & 9 Total',   back: 1.97, suspended: false },
  { id: 'tot_10_11', name: '10 & 11 Total', back: 1.97, suspended: false },
]

/* ── Digits 1 to 0 Market ─────────────────────────────────────── */
const NUMBER_MARKET = [
  { id: 'n1', num: '1', odds: 9.5, suspended: false },
  { id: 'n2', num: '2', odds: 9.5, suspended: false },
  { id: 'n3', num: '3', odds: 9.5, suspended: false },
  { id: 'n4', num: '4', odds: 9.5, suspended: false },
  { id: 'n5', num: '5', odds: 9.5, suspended: false },
  { id: 'n6', num: '6', odds: 9.5, suspended: false },
  { id: 'n7', num: '7', odds: 9.5, suspended: false },
  { id: 'n8', num: '8', odds: 9.5, suspended: false },
  { id: 'n9', num: '9', odds: 9.5, suspended: false },
  { id: 'n0', num: '0', odds: 9.5, suspended: false },
]

/* ── Live Overlay Cards Data (Player 8, 9, 10, 11) ────────────── */
const INITIAL_VIDEO_PLAYERS = [
  {
    id: 'p8',
    label: 'Player 8',
    base: 8,
    total: 19,
    isLeading: false,
    card: {
      rank: 'J',
      suit: '♥',
      color: 'red',
      img: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/JHH.jpg',
      flipped: true,
    },
  },
  {
    id: 'p9',
    label: 'Player 9',
    base: 9,
    total: 17,
    isLeading: false,
    className: 'mt-1',
    card: {
      rank: '8',
      suit: '♠',
      color: 'black',
      img: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/8SS.jpg',
      flipped: true,
    },
  },
  {
    id: 'p10',
    label: 'Player 10',
    base: 10,
    total: 16,
    isLeading: false,
    className: 'mt-1',
    card: {
      rank: '6',
      suit: '♠',
      color: 'black',
      img: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/6SS.jpg',
      flipped: true,
    },
  },
  {
    id: 'p11',
    label: 'Player 11',
    base: 11,
    total: 24,
    isLeading: true,
    className: 'mt-1',
    card: {
      rank: 'K',
      suit: '♦',
      color: 'red',
      img: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/KDD.jpg',
      flipped: true,
    },
  },
]

/* ── Last 10 Results (8, 11, 10, 8, 10, 10, 10, 8, 11, 10) ───── */
const LAST_RESULTS = [
  { id: 1,  winner: '8',  roundId: '114260822160141', p8: 25, p9: 20, p10: 19, p11: 22 },
  { id: 2,  winner: '11', roundId: '114260822160140', p8: 18, p9: 21, p10: 20, p11: 24 },
  { id: 3,  winner: '10', roundId: '114260822160139', p8: 19, p9: 20, p10: 23, p11: 21 },
  { id: 4,  winner: '8',  roundId: '114260822160138', p8: 24, p9: 22, p10: 21, p11: 20 },
  { id: 5,  winner: '10', roundId: '114260822160137', p8: 17, p9: 21, p10: 24, p11: 22 },
  { id: 6,  winner: '10', roundId: '114260822160136', p8: 19, p9: 20, p10: 25, p11: 21 },
  { id: 7,  winner: '10', roundId: '114260822160135', p8: 18, p9: 22, p10: 23, p11: 22 },
  { id: 8,  winner: '8',  roundId: '114260822160134', p8: 26, p9: 21, p10: 19, p11: 20 },
  { id: 9,  winner: '11', roundId: '114260822160133', p8: 19, p9: 20, p10: 22, p11: 25 },
  { id: 10, winner: '10', roundId: '114260822160132', p8: 18, p9: 21, p10: 24, p11: 23 },
]

/* ── Flip Card Component ──────────────────────────────────────── */
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
        {/* Back side of card */}
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
            <div className={`playing-card-face ${card.color || 'black'}`}>
              <div className="card-corner">
                <span>{card.rank}</span>
                <span>{card.suit}</span>
              </div>
              <div className="card-center">{card.suit}</div>
              <div className="card-corner" style={{ transform: 'rotate(180deg)' }}>
                <span>{card.rank}</span>
                <span>{card.suit}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Card32B() {
  const [showRules, setShowRules] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)
  const [isMuted, setIsMuted] = useState(true)
  const [roundId] = useState('114260822160142')
  const [mainPlayers] = useState(MAIN_PLAYERS)
  const [colorMarket] = useState(COLOR_MARKET)
  const [totalMarket] = useState(TOTAL_MARKET)
  const [numberMarket] = useState(NUMBER_MARKET)
  const [videoPlayers] = useState(INITIAL_VIDEO_PLAYERS)

  const oddEvenRunners = mainPlayers.map((p) => ({
    id: `oe-${p.id}`,
    name: p.name,
    back: p.odd,
    lay: p.even,
    betNameBack: `${p.name} Odd`,
    betNameLay: `${p.name} Even`,
    layBetType: 'back',
    suspendedBack: p.suspended || !p.odd || Number(p.odd) === 0,
    suspendedLay: p.suspended || !p.even || Number(p.even) === 0,
  }))

  return (
    <CasinoLayout
      title="32 CARDS B"
      roundId={roundId}
      rulesLink="#rules"
      onRulesClick={() => setShowRules(true)}
    >
      {({ onOddClick }) => {
        // Handler for clicking on Back/Lay/Odd/Even odds
        const handleBetClick = (runnerName, odds, type, isSuspended) => {
          if (isSuspended || !odds || Number(odds) <= 0) return
          onOddClick({ name: runnerName, [type]: odds }, type)
        }

        return (
          <div className="casino-page-container cards32b">
            {/* ── Video Stream & Overlay Area ── */}
            <div className="casino-video">
              {/* Sound Toggle Button */}
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
                    src={`/newmediaplayer/card32eu/d091e266-408f-450c-ab2d-971a496f04bd?ip=103.198.173.38&muted=${isMuted ? 1 : 0}`}
                    title="32 Cards B Live Stream"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Video Cards Overlay (Top Left: Player 8, 9, 10, 11) */}
              <CasinoVideoCards>
                {videoPlayers.map((player) => (
                  <div key={player.id} className={player.className || ''}>
                    <h5 className={player.isLeading ? 'text-success' : ''}>
                      {player.label}: <span className="text-warning">{player.total}</span>
                    </h5>
                    <div className="flip-card-container">
                      <FlipPlayingCard card={player.card} />
                    </div>
                  </div>
                ))}
              </CasinoVideoCards>

              {/* Countdown FlipClock Timer (Bottom Right) */}
              <div className="clock">
                <FlipClock seconds={5} />
              </div>
            </div>

            {/* ── Casino Detail Section ── */}
            <div className="casino-detail">
              <div className="casino-table">
                {/* ── 1. Main Players & Odd / Even Table ── */}
                <CasinoDualTable
                  leftRunners={mainPlayers}
                  rightRunners={oddEvenRunners}
                  rightHeaderBack="Odd"
                  rightHeaderLay="Even"
                  rightHeaderLayType="back"
                  onBetClick={handleBetClick}
                />

                {/* ── 2. Color Combinations & Totals Table (SS2 / SS3 Layout) ── */}
                <CasinoDualTable
                  className="mt-3"
                  leftRunners={colorMarket}
                  rightRunners={totalMarket}
                  rightHeaderBack="Back"
                  rightHeaderLay={null}
                  onBetClick={handleBetClick}
                />

                {/* ── 3. Digits 1 to 0 Prediction Full Width Table ── */}
                <CasinoNumbersGrid
                  className="mt-3"
                  title="9.5"
                  items={numberMarket}
                  onBetClick={handleBetClick}
                />
              </div>

              {/* ── Last Result Section ── */}
              <CasinoLastResults
                title="Last Result"
                viewAllLink="/casino-results/card32eu"
                results={LAST_RESULTS}
                renderResult={(res, idx) => (
                  <span
                    key={res.id || idx}
                    className="result result-b"
                    onClick={() => setSelectedResult(res)}
                    title={`Round: ${res.roundId} | Winner: Player ${res.winner}`}
                  >
                    {res.winner}
                  </span>
                )}
              />
            </div>

            {/* Hidden Table from reference HTML for matched bet data binding */}
            <div className="d-none">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Matched Bet</th>
                      <th className="text-end">Odds</th>
                      <th className="text-end">Stake</th>
                    </tr>
                  </thead>
                  <tbody />
                </table>
              </div>
            </div>

            {/* ── 32 Cards B Rules Modal ── */}
            {showRules && (
              <CommonModal
                show={showRules}
                onClose={() => setShowRules(false)}
                title="32 Cards B — Game Rules"
                position="center"
                showFooter={true}
              >
                <div style={{ padding: '14px', lineHeight: 1.6, fontSize: '13px', color: '#334155' }}>
                  <h6 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Game Overview</h6>
                  <p>
                    <strong>32 Cards B</strong> is played with a 32-card deck (cards 2, 3, 4, and 5 removed).
                    Cards <strong>6 to King and Ace</strong> are used.
                  </p>

                  <h6 style={{ fontWeight: 800, color: '#0f172a', marginTop: '12px', marginBottom: '8px' }}>The 4 Players & Base Points</h6>
                  <ul style={{ paddingLeft: '20px', marginBottom: '10px' }}>
                    <li><strong>Player 8:</strong> Starts with base point of <strong>8</strong></li>
                    <li><strong>Player 9:</strong> Starts with base point of <strong>9</strong></li>
                    <li><strong>Player 10:</strong> Starts with base point of <strong>10</strong></li>
                    <li><strong>Player 11:</strong> Starts with base point of <strong>11</strong></li>
                  </ul>

                  <h6 style={{ fontWeight: 800, color: '#0f172a', marginTop: '12px', marginBottom: '8px' }}>Available Betting Markets</h6>
                  <ul style={{ paddingLeft: '20px', marginBottom: '10px' }}>
                    <li><strong>Main Winner:</strong> Back / Lay on Player 8, 9, 10, 11</li>
                    <li><strong>Odd / Even:</strong> Bet on whether each Player’s final total score will be Odd or Even</li>
                    <li><strong>Color Combination:</strong> Any 3 Card Black, Any 3 Card Red, Two Black Two Red</li>
                    <li><strong>Totals:</strong> 8 &amp; 9 Combined Total, 10 &amp; 11 Combined Total</li>
                    <li><strong>Digit Prediction:</strong> Predict individual numbers 1 to 0</li>
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
                <div className="card32-result-modal">
                  <div className="card32-result-round-header">
                    <span>Round ID: <strong>{selectedResult.roundId}</strong></span>
                    <span className="card32-result-winner">
                      Winner: Player {selectedResult.winner}
                    </span>
                  </div>
                  <div className="card32-player-score-grid">
                    <div className={`card32-player-card-box ${selectedResult.winner === '8' ? 'winner' : ''}`}>
                      <div className="card32-player-name">
                        <span>Player 8</span>
                        {selectedResult.winner === '8' && <span>👑 WINNER</span>}
                      </div>
                      <div className="card32-player-score-total">Score: {selectedResult.p8}</div>
                    </div>

                    <div className={`card32-player-card-box ${selectedResult.winner === '9' ? 'winner' : ''}`}>
                      <div className="card32-player-name">
                        <span>Player 9</span>
                        {selectedResult.winner === '9' && <span>👑 WINNER</span>}
                      </div>
                      <div className="card32-player-score-total">Score: {selectedResult.p9}</div>
                    </div>

                    <div className={`card32-player-card-box ${selectedResult.winner === '10' ? 'winner' : ''}`}>
                      <div className="card32-player-name">
                        <span>Player 10</span>
                        {selectedResult.winner === '10' && <span>👑 WINNER</span>}
                      </div>
                      <div className="card32-player-score-total">Score: {selectedResult.p10}</div>
                    </div>

                    <div className={`card32-player-card-box ${selectedResult.winner === '11' ? 'winner' : ''}`}>
                      <div className="card32-player-name">
                        <span>Player 11</span>
                        {selectedResult.winner === '11' && <span>👑 WINNER</span>}
                      </div>
                      <div className="card32-player-score-total">Score: {selectedResult.p11}</div>
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
