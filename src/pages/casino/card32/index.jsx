/**
 * 32 Cards A (card32)
 * ───────────────────
 * Live casino 32 Cards A page matching reference HTML, DOM structure and screenshot:
 *   • Video Stream + Sound Toggle + Video Cards Overlay (Player 8, 9, 10, 11 with points and flip cards)
 *   • Countdown FlipClock (seconds timer)
 *   • Casino Table:
 *       - Left Box: Player 8 (Back / Lay), Player 9 (Back / Lay)
 *       - Right Box: Player 10 (Back / Lay), Player 11 (Back / Lay)
 *   • Casino Last Results (Green circular pills 11, 10, 9, 8... + Result detail modal)
 *   • Rules Modal for 32 Cards A
 *   • Full integration with CasinoLayout (Sidebar bet slip, MobileTabs, PlaceBetModal)
 */

import { useState } from 'react'
import CasinoLayout from '../../../components/CasinoLayout'
import FlipClock from '../../../components/FlipClock'
import CommonModal from '../../../components/Modal'
import CasinoLastResults from '../../../components/CasinoLastResults'
import CasinoVideoCards from '../../../components/CasinoVideoCards'
import CasinoDualTable from '../../../components/CasinoDualTable'
import './style.css'

/* ── Market Odds Data (Matching Screenshot & Reference) ───────── */
const INITIAL_MARKET = [
  { id: 'p8',  name: 'Player 8',  back: 12.2, lay: 13.7, suspendedBack: false, suspendedLay: false },
  { id: 'p9',  name: 'Player 9',  back: 5.95, lay: 6.45, suspendedBack: false, suspendedLay: false },
  { id: 'p10', name: 'Player 10', back: 3.20, lay: 3.45, suspendedBack: false, suspendedLay: false },
  { id: 'p11', name: 'Player 11', back: 2.08, lay: 2.18, suspendedBack: false, suspendedLay: false },
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
      suit: '♣',
      color: 'black',
      img: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/JCC.jpg',
      flipped: true,
    },
  },
  {
    id: 'p9',
    label: 'Player 9',
    base: 9,
    total: 22,
    isLeading: true,
    className: 'mt-1',
    card: {
      rank: 'K',
      suit: '♠',
      color: 'black',
      img: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/KSS.jpg',
      flipped: true,
    },
  },
  {
    id: 'p10',
    label: 'Player 10',
    base: 10,
    total: 22,
    isLeading: true,
    className: 'mt-1',
    card: {
      rank: 'Q',
      suit: '♣',
      color: 'black',
      img: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/QCC.jpg',
      flipped: true,
    },
  },
  {
    id: 'p11',
    label: 'Player 11',
    base: 11,
    total: 20,
    isLeading: false,
    className: 'mt-1',
    card: {
      rank: '9',
      suit: '♥',
      color: 'red',
      img: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/9HH.jpg',
      flipped: true,
    },
  },
]

/* ── Last 10 Results (11, 10, 10, 9, 8, 9, 10, 10, 10, 11) ──── */
const LAST_RESULTS = [
  { id: 1,  winner: '11', roundId: '113260822155727', p8: 18, p9: 20, p10: 21, p11: 23 },
  { id: 2,  winner: '10', roundId: '113260822155726', p8: 19, p9: 21, p10: 24, p11: 22 },
  { id: 3,  winner: '10', roundId: '113260822155725', p8: 17, p9: 20, p10: 23, p11: 21 },
  { id: 4,  winner: '9',  roundId: '113260822155724', p8: 19, p9: 25, p10: 22, p11: 20 },
  { id: 5,  winner: '8',  roundId: '113260822155723', p8: 26, p9: 20, p10: 19, p11: 21 },
  { id: 6,  winner: '9',  roundId: '113260822155722', p8: 18, p9: 24, p10: 22, p11: 21 },
  { id: 7,  winner: '10', roundId: '113260822155721', p8: 17, p9: 21, p10: 25, p11: 20 },
  { id: 8,  winner: '10', roundId: '113260822155720', p8: 19, p9: 20, p10: 23, p11: 22 },
  { id: 9,  winner: '10', roundId: '113260822155719', p8: 18, p9: 22, p10: 24, p11: 21 },
  { id: 10, winner: '11', roundId: '113260822155718', p8: 19, p9: 21, p10: 22, p11: 25 },
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

export default function Card32() {
  const [showRules, setShowRules] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)
  const [isMuted, setIsMuted] = useState(true)
  const [roundId] = useState('113260822155728')
  const [market] = useState(INITIAL_MARKET)
  const [videoPlayers] = useState(INITIAL_VIDEO_PLAYERS)

  // Split 4 runners into left (Player 8, 9) and right (Player 10, 11)
  const leftRunners = market.slice(0, 2)
  const rightRunners = market.slice(2, 4)

  return (
    <CasinoLayout
      title="32 CARDS A"
      roundId={roundId}
      rulesLink="#rules"
      onRulesClick={() => setShowRules(true)}
    >
      {({ onOddClick }) => {
        // Handler for clicking on Back/Lay odds
        const handleBetClick = (runnerName, odds, type, isSuspended) => {
          if (isSuspended || !odds || Number(odds) <= 0) return
          onOddClick({ name: runnerName, [type]: odds }, type)
        }

        return (
          <div className="casino-page-container cards32a">
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
                    src={`/newmediaplayer/card32/4a4fdf0e-91d9-4d5e-a8fe-ab1ac5af3a81?ip=103.198.173.38&muted=${isMuted ? 1 : 0}`}
                    title="32 Cards A Live Stream"
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
                <FlipClock seconds={6} />
              </div>
            </div>

            {/* ── Casino Detail Section ── */}
            <div className="casino-detail">
              <div className="casino-table">
                <CasinoDualTable
                  leftTitle=""
                  rightTitle=""
                  leftRunners={leftRunners}
                  rightRunners={rightRunners}
                  onBetClick={handleBetClick}
                />
              </div>

              {/* ── Last Result Section ── */}
              <CasinoLastResults
                title="Last Result"
                viewAllLink="/casino-results/card32"
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

            {/* ── 32 Cards Rules Modal ── */}
            {showRules && (
              <CommonModal
                show={showRules}
                onClose={() => setShowRules(false)}
                title="32 Cards A — Game Rules"
                position="center"
                showFooter={true}
              >
                <div style={{ padding: '14px', lineHeight: 1.6, fontSize: '13px', color: '#334155' }}>
                  <h6 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Game Overview</h6>
                  <p>
                    <strong>32 Cards</strong> is played with a customized 32-card deck (cards 2, 3, 4, and 5 are removed).
                    The deck contains cards from <strong>6 to King and Ace</strong>.
                  </p>

                  <h6 style={{ fontWeight: 800, color: '#0f172a', marginTop: '12px', marginBottom: '8px' }}>The 4 Players & Base Points</h6>
                  <ul style={{ paddingLeft: '20px', marginBottom: '10px' }}>
                    <li><strong>Player 8:</strong> Starts with base point of <strong>8</strong></li>
                    <li><strong>Player 9:</strong> Starts with base point of <strong>9</strong></li>
                    <li><strong>Player 10:</strong> Starts with base point of <strong>10</strong></li>
                    <li><strong>Player 11:</strong> Starts with base point of <strong>11</strong></li>
                  </ul>

                  <h6 style={{ fontWeight: 800, color: '#0f172a', marginTop: '12px', marginBottom: '8px' }}>Card Values</h6>
                  <ul style={{ paddingLeft: '20px', marginBottom: '10px' }}>
                    <li><strong>Ace:</strong> 1 point</li>
                    <li><strong>Numbers 6 – 10:</strong> Face value (6, 7, 8, 9, 10 points)</li>
                    <li><strong>Jack (J):</strong> 11 points</li>
                    <li><strong>Queen (Q):</strong> 12 points</li>
                    <li><strong>King (K):</strong> 13 points</li>
                  </ul>

                  <h6 style={{ fontWeight: 800, color: '#0f172a', marginTop: '12px', marginBottom: '8px' }}>Determining the Winner</h6>
                  <p>
                    One card is dealt to each player. Total score = <code>Base Points + Card Point</code>.
                    The player with the highest overall point total wins the round. If there is a tie for the highest score, additional cards are dealt until a single winner emerges.
                  </p>
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
