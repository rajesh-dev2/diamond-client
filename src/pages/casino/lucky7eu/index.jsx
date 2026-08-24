import { useState } from 'react'
import CasinoLayout from '../../../components/CasinoLayout'
import FlipClock from '../../../components/FlipClock'
import CommonModal from '../../../components/Modal'
import CasinoLastResults from '../../../components/CasinoLastResults'
import CasinoVideoCards from '../../../components/CasinoVideoCards'
import './style.css'

/* ── Lucky 7 - B Configuration ────────────────────────────────── */
const CONFIG = {
  title: 'LUCKY 7 - B',
  code: 'lucky7eu',
  streamUrl: '/newmediaplayer/lucky7eu/bf99dcdf-8d04-44c6-bdd4-bf99c95ccea5?ip=103.198.173.38',
  defaultRoundId: '107260824102553',
}

/* ── Market Data for Lucky 7 - B ─────────────────────────────── */
const DEFAULT_MARKET = {
  lowCard:   { name: 'Low Card (A-6)',  odds: '2',    suspended: false },
  highCard:  { name: 'High Card (8-K)', odds: '2',    suspended: false },
  even:      { name: 'Even',            odds: '2.1',  suspended: false },
  odd:       { name: 'Odd',             odds: '1.79', suspended: false },
  redSuit:   { name: 'Red Suits',       odds: '1.95', suspended: false },
  blackSuit: { name: 'Black Suits',     odds: '1.95', suspended: false },
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

/* ── Last 10 Results (L, H, H, L, H, H, H, L, H, H) ───────────── */
const LAST_RESULTS = [
  { id: 1,  winner: 'L', card: '4♥',  result: 'Low',  roundId: '107260824102552' },
  { id: 2,  winner: 'H', card: '10♠', result: 'High', roundId: '107260824102551' },
  { id: 3,  winner: 'H', card: '8♦',  result: 'High', roundId: '107260824102550' },
  { id: 4,  winner: 'L', card: '2♣',  result: 'Low',  roundId: '107260824102549' },
  { id: 5,  winner: 'H', card: 'K♥',  result: 'High', roundId: '107260824102548' },
  { id: 6,  winner: 'H', card: '9♠',  result: 'High', roundId: '107260824102547' },
  { id: 7,  winner: 'H', card: 'Q♦',  result: 'High', roundId: '107260824102546' },
  { id: 8,  winner: 'L', card: '5♠',  result: 'Low',  roundId: '107260824102545' },
  { id: 9,  winner: 'H', card: 'J♣',  result: 'High', roundId: '107260824102544' },
  { id: 10, winner: 'H', card: '9♥',  result: 'High', roundId: '107260824102543' },
]

export default function Lucky7B() {
  const [showRules, setShowRules] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)
  const [isMuted, setIsMuted] = useState(true)
  const [roundId] = useState(CONFIG.defaultRoundId)
  const [market] = useState(DEFAULT_MARKET)

  return (
    <CasinoLayout
      title={CONFIG.title}
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
          <div className="casino-page-container lucky7b lucky7eu-page">
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
                    src={`${CONFIG.streamUrl}&muted=${isMuted ? 1 : 0}`}
                    title={`${CONFIG.title} Live Stream`}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Reusable Video Player Cards Overlay (Top-Left) */}
              <CasinoVideoCards>
                <div>
                  <div className="flip-card-container">
                    <div className="flip-card">
                      <div className="flip-card-inner">
                        <div className="flip-card-front">
                          <img
                            src="https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/1.jpg"
                            onError={(e) => {
                              e.currentTarget.src = '/img/game-card.png'
                            }}
                            alt="Card Back"
                          />
                        </div>
                        <div className="flip-card-back">
                          <img
                            src="/img/game-card.png"
                            alt="Card Front"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CasinoVideoCards>

              {/* Countdown FlipClock Timer (Bottom-Right) */}
              <div className="clock flip-clock-wrapper">
                <FlipClock seconds={20} />
              </div>
            </div>

            {/* ── Casino Detail Section ── */}
            <div className="casino-detail">
              <div className="casino-table">
                {/* ── Row 1: Low Card, Center 7, High Card ── */}
                <div className="casino-table-full-box">
                  {/* Low Card */}
                  <div
                    className="lucky7low"
                    onClick={() => handleBetClick('Low Card', market.lowCard.odds, 'back', market.lowCard.suspended)}
                  >
                    <div className="casino-odds text-center">
                      {market.lowCard.suspended ? '0' : market.lowCard.odds}
                    </div>
                    <div className={`casino-odds-box back casino-odds-box-theme ${market.lowCard.suspended ? 'suspended-box' : ''}`}>
                      <span className="casino-odds">Low Card</span>
                    </div>
                    <div className="casino-nation-book text-center"></div>
                  </div>

                  {/* Center 7 Card Image */}
                  <div className="lucky7">
                    <img
                      src="https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/7.png"
                      onError={(e) => {
                        e.currentTarget.src = '/img/game-card.png'
                      }}
                      alt="7"
                    />
                  </div>

                  {/* High Card */}
                  <div
                    className="lucky7high"
                    onClick={() => handleBetClick('High Card', market.highCard.odds, 'back', market.highCard.suspended)}
                  >
                    <div className="casino-odds text-center">
                      {market.highCard.suspended ? '0' : market.highCard.odds}
                    </div>
                    <div className={`casino-odds-box back casino-odds-box-theme ${market.highCard.suspended ? 'suspended-box' : ''}`}>
                      <span className="casino-odds">High Card</span>
                    </div>
                    <div className="casino-nation-book text-center"></div>
                  </div>
                </div>

                {/* ── Row 2: Even/Odd & Red/Black Suits ── */}
                <div className="casino-table-box mt-3">
                  <div className="casino-table-left-box">
                    <div
                      className="lucky7odds"
                      onClick={() => handleBetClick('Even', market.even.odds, 'back', market.even.suspended)}
                    >
                      <div className="casino-odds text-center">
                        {market.even.suspended ? '0' : market.even.odds}
                      </div>
                      <div className={`casino-odds-box back casino-odds-box-theme ${market.even.suspended ? 'suspended-box' : ''}`}>
                        <span className="casino-odds">Even</span>
                      </div>
                      <div className="casino-nation-book text-center"></div>
                    </div>

                    <div
                      className="lucky7odds"
                      onClick={() => handleBetClick('Odd', market.odd.odds, 'back', market.odd.suspended)}
                    >
                      <div className="casino-odds text-center">
                        {market.odd.suspended ? '0' : market.odd.odds}
                      </div>
                      <div className={`casino-odds-box back casino-odds-box-theme ${market.odd.suspended ? 'suspended-box' : ''}`}>
                        <span className="casino-odds">Odd</span>
                      </div>
                      <div className="casino-nation-book text-center"></div>
                    </div>
                  </div>

                  <div className="casino-table-right-box">
                    <div
                      className="lucky7odds"
                      onClick={() => handleBetClick('Red Suits', market.redSuit.odds, 'back', market.redSuit.suspended)}
                    >
                      <div className="casino-odds text-center">
                        {market.redSuit.suspended ? '0' : market.redSuit.odds}
                      </div>
                      <div className={`casino-odds-box back casino-odds-box-theme ${market.redSuit.suspended ? 'suspended-box' : ''}`}>
                        <span className="casino-odds">
                          <span className="card-icon ms-1"><span className="card-red">♥</span></span>
                          <span className="card-icon ms-1"><span className="card-red">♦</span></span>
                        </span>
                      </div>
                      <div className="casino-nation-book text-center"></div>
                    </div>

                    <div
                      className="lucky7odds"
                      onClick={() => handleBetClick('Black Suits', market.blackSuit.odds, 'back', market.blackSuit.suspended)}
                    >
                      <div className="casino-odds text-center">
                        {market.blackSuit.suspended ? '0' : market.blackSuit.odds}
                      </div>
                      <div className={`casino-odds-box back casino-odds-box-theme ${market.blackSuit.suspended ? 'suspended-box' : ''}`}>
                        <span className="casino-odds">
                          <span className="card-icon ms-1"><span className="card-black">♠</span></span>
                          <span className="card-icon ms-1"><span className="card-black">♣</span></span>
                        </span>
                      </div>
                      <div className="casino-nation-book text-center"></div>
                    </div>
                  </div>
                </div>

                {/* ── Row 3: 4 Card Groups (A-2-3, 4-5-6, 8-9-10, J-Q-K) ── */}
                <div className="lucky7-groups-box mt-3">
                  {market.groups.map((grp) => (
                    <div
                      key={grp.id}
                      className="lucky7cards"
                      onClick={() => handleBetClick(grp.name, grp.odds, 'back', grp.suspended)}
                    >
                      <div className="casino-odds w-100 text-center">
                        {grp.suspended ? '0' : grp.odds}
                      </div>
                      <div className={`card-odd-box-container ${grp.suspended ? 'suspended-box' : ''}`}>
                        {grp.cards.map((cardRank, cIdx) => (
                          <div key={cIdx} className="card-odd-box">
                            <div>
                              <img
                                src={`https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/${cardRank}.png`}
                                onError={(e) => {
                                  e.currentTarget.src = '/img/game-card.png'
                                }}
                                alt={cardRank}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="casino-nation-book text-center w-100"></div>
                    </div>
                  ))}
                </div>

                {/* ── Row 4: 13 Single Cards (A to K) ── */}
                <div className="casino-table-full-box lucky7acards mt-3">
                  <div className="casino-odds w-100 text-center">12</div>
                  <div className="lucky7acards-grid">
                    {market.singles.map((single, sIdx) => (
                      <div
                        key={`single-${sIdx}`}
                        className="card-odd-box"
                        onClick={() => handleBetClick(`Card ${single.rank}`, single.odds, 'back', single.suspended)}
                      >
                        <div className={single.suspended ? 'suspended-box' : ''}>
                          <img
                            src={`https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/${single.rank}.png`}
                            onError={(e) => {
                              e.currentTarget.src = '/img/game-card.png'
                            }}
                            alt={single.rank}
                          />
                        </div>
                        <div className="casino-nation-book"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Row 5: Reusable Casino Last Results Component ── */}
                <CasinoLastResults
                  title="Last Result"
                  viewAllLink={`/casino-results/${CONFIG.code}`}
                  results={LAST_RESULTS}
                  renderResult={(res, idx) => {
                    let badgeClass = 'result'
                    if (res.winner === 'H') badgeClass = 'result result-b'
                    else if (res.winner === 'L') badgeClass = 'result result-a'

                    return (
                      <span
                        key={res.id || idx}
                        className={badgeClass}
                        onClick={() => setSelectedResult(res)}
                        title={`Round: ${res.roundId} | Card: ${res.card} (${res.result})`}
                      >
                        {res.winner}
                      </span>
                    )
                  }}
                />
              </div>
            </div>

            {/* Hidden Table for Matched Bet Data Binding */}
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

            {/* ── Rules Modal ── */}
            {showRules && (
              <CommonModal
                show={showRules}
                onClose={() => setShowRules(false)}
                title={`${CONFIG.title} — Game Rules`}
                position="center"
                showFooter={true}
              >
                <div style={{ padding: '14px', lineHeight: 1.6, fontSize: '13px', color: '#334155' }}>
                  <h6 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Game Concept</h6>
                  <p>
                    <strong>Lucky 7 - B</strong> is a fast-paced card game where one standard 52-card deck is used.
                    A single card is dealt each round, and players bet on whether the card will be <strong>Below 7 (Low Card)</strong>, <strong>Above 7 (High Card)</strong>, or exactly <strong>7</strong>.
                  </p>

                  <h6 style={{ fontWeight: 800, color: '#0f172a', marginTop: '12px', marginBottom: '8px' }}>Betting Markets</h6>
                  <ul style={{ paddingLeft: '20px', marginBottom: '10px' }}>
                    <li><strong>Low Card (A, 2, 3, 4, 5, 6):</strong> Pays 2.00</li>
                    <li><strong>High Card (8, 9, 10, J, Q, K):</strong> Pays 2.00</li>
                    <li><strong>Exact 7:</strong> Pays 12.00</li>
                    <li><strong>Even / Odd:</strong> Bet on whether the card value is Even or Odd</li>
                    <li><strong>Suits:</strong> Red (♥ ♦) or Black (♠ ♣)</li>
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
