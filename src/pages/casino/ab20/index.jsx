/**
 * 20-20 Andar Bahar (ab20)
 * ────────────────────────
 * Live casino Andar Bahar 20-20 page matching the live DiamondExch interface:
 *   • Top video stream with live dealing cards overlay (Row A & Row B) & FlipClock
 *   • Row 1: Main A vs B (Main & 1st Card) with yellow highlighted borders
 *   • Row 2: Dual Box (ODD/EVEN + 4 Suits: ♠, ♣, ♥, ♦)
 *   • Row 3: Centered 13 Card values grid (A through K) with rank, lock icon & mini suits
 *   • Row 4: Last Result bar with green/olive circular badges
 *   • Full integration with CasinoLayout & bet placement
 */

import { useState } from 'react'
import CasinoLayout from '../../../components/CasinoLayout'
import FlipClock from '../../../components/FlipClock'
import CommonModal from '../../../components/Modal'
import CasinoCardSlider from '../../../components/CasinoCardSlider'
import CasinoLastResults from '../../../components/CasinoLastResults'
import './style.css'

// Inline Lock SVG icon
function LockIcon({ className = 'ab-lock-icon' }) {
  return (
    <svg className={className} viewBox="0 0 448 512" fill="currentColor">
      <path d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zM264 392c0 22.1-17.9 40-40 40s-40-17.9-40-40v-48c0-22.1 17.9-40 40-40s40 17.9 40 40v48zm32-168H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z" />
    </svg>
  )
}

/* ── Live Overlay Stream Cards Data ───────────────────────────── */
const STREAM_DEALING_STATE = {
  jokerCard: {
    rank: '8',
    suit: '♠',
    color: 'black',
    img: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/8S.png',
  },
  andarCards: [
    { rank: '4', suit: '♥', color: 'red',   img: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/4H.png' },
    { rank: 'K', suit: '♣', color: 'black', img: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/KC.png' },
    { rank: '8', suit: '♦', color: 'red',   img: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/8D.png' },
  ],
  baharCards: [
    { rank: '7', suit: '♠', color: 'black', img: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/7S.png' },
    { rank: '2', suit: '♣', color: 'black', img: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/2C.png' },
  ],
}

/* ── 13 Card Values Config (A - K) ────────────────────────────── */
const CARD_RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

/* ── Last 10 Results (A, B, A, A, B, A, B, B, A, B) ───────────── */
const LAST_RESULTS = [
  { id: 1,  winner: 'A', roundId: '114260824141021', cardsCount: 7,  joker: '8♠', winCard: '8♦' },
  { id: 2,  winner: 'B', roundId: '114260824141020', cardsCount: 4,  joker: 'K♥', winCard: 'K♠' },
  { id: 3,  winner: 'A', roundId: '114260824141019', cardsCount: 11, joker: '5♣', winCard: '5♥' },
  { id: 4,  winner: 'A', roundId: '114260824141018', cardsCount: 3,  joker: 'Q♦', winCard: 'Q♣' },
  { id: 5,  winner: 'B', roundId: '114260824141017', cardsCount: 6,  joker: '2♠', winCard: '2♥' },
  { id: 6,  winner: 'A', roundId: '114260824141016', cardsCount: 5,  joker: '9♥', winCard: '9♦' },
  { id: 7,  winner: 'B', roundId: '114260824141015', cardsCount: 8,  joker: 'J♣', winCard: 'J♠' },
  { id: 8,  winner: 'B', roundId: '114260824141014', cardsCount: 2,  joker: 'A♦', winCard: 'A♠' },
  { id: 9,  winner: 'A', roundId: '114260824141013', cardsCount: 9,  joker: '7♠', winCard: '7♥' },
  { id: 10, winner: 'B', roundId: '114260824141012', cardsCount: 4,  joker: '10♣', winCard: '10♦' },
]

export default function Ab20() {
  const [showRules, setShowRules] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)
  const [isMuted, setIsMuted] = useState(true)
  const [roundId] = useState('114260824141022')
  const [streamCards] = useState(STREAM_DEALING_STATE)

  return (
    <CasinoLayout
      title="20-20 ANDAR BAHAR"
      roundId={roundId}
      rulesLink="#rules"
      onRulesClick={() => setShowRules(true)}
    >
      {({ onOddClick }) => {
        const handleBet = (runnerName, odds = '1.98') => {
          onOddClick({ name: runnerName, back: odds }, 'back')
        }

        return (
          <div className="casino-page-container ab20-page">
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
                    src={`/newmediaplayer/ab20/4a4fdf0e-91d9-4d5e-a8fe-ab1ac5af3a81?ip=103.198.173.38&muted=${isMuted ? 1 : 0}`}
                    title="20-20 Andar Bahar Live Stream"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Top-Left Slick Card Dealing Slider Overlay */}
              <CasinoCardSlider
                jokerCard={streamCards.jokerCard}
                andarCards={streamCards.andarCards}
                baharCards={streamCards.baharCards}
              />

              {/* Countdown FlipClock Timer (Bottom Right) */}
              <div className="clock">
                <FlipClock seconds={1} />
              </div>
            </div>

            {/* ── Casino Detail Section ── */}
            <div className="casino-detail">
              {/* ═══════════════════════════════════════════════════════════════
                 Betting Tables Section
                 ═══════════════════════════════════════════════════════════════ */}
              <div className="ab-markets-container">
                {/* ── Row 1: Main Table (A vs B with Yellow Border Boxes) ── */}
                <div className="ab-main-row">
                  {/* Side A Group */}
                  <div className="ab-group-wrapper">
                    <span className="ab-side-label">A</span>
                    <div className="ab-yellow-boxes-strip">
                      <div className="ab-yellow-box" onClick={() => handleBet('Andar (A)', '1.98')}>
                        <span className="ab-box-title">Andar (A)</span>
                        <LockIcon />
                      </div>
                      <div className="ab-yellow-box" onClick={() => handleBet('Andar 1st Card', '3.80')}>
                        <span className="ab-box-title">1st Card</span>
                        <LockIcon />
                      </div>
                    </div>
                    <span className="ab-side-label">A</span>
                  </div>

                  {/* Side B Group */}
                  <div className="ab-group-wrapper">
                    <span className="ab-side-label">B</span>
                    <div className="ab-yellow-boxes-strip">
                      <div className="ab-yellow-box" onClick={() => handleBet('Bahar (B)', '1.98')}>
                        <span className="ab-box-title">Bahar (B)</span>
                        <LockIcon />
                      </div>
                      <div className="ab-yellow-box" onClick={() => handleBet('Bahar 1st Card', '3.80')}>
                        <span className="ab-box-title">1st Card</span>
                        <LockIcon />
                      </div>
                    </div>
                    <span className="ab-side-label">B</span>
                  </div>
                </div>

                {/* ── Row 2: Dual Box Container (ODD/EVEN + 4 SUITS) ── */}
                <div className="ab-dual-row">
                  {/* Left Card: ODD / EVEN */}
                  <div className="ab-dual-card">
                    <div className="ab-dual-header cols-2">
                      <div className="ab-header-cell">ODD</div>
                      <div className="ab-header-cell">EVEN</div>
                    </div>
                    <div className="ab-dual-content cols-2">
                      <div className="ab-dark-btn" onClick={() => handleBet('ODD', '1.80')}>
                        <LockIcon />
                      </div>
                      <div className="ab-dark-btn" onClick={() => handleBet('EVEN', '2.10')}>
                        <LockIcon />
                      </div>
                    </div>
                  </div>

                  {/* Right Card: 4 Suits (♠, ♣, ♥, ♦) */}
                  <div className="ab-dual-card">
                    <div className="ab-dual-header cols-4">
                      <div className="ab-header-cell black text-base">
                        <img src="/icons/spade.png" alt="Spade" className="w-[18px] h-[18px] object-contain inline-block" />
                      </div>
                      <div className="ab-header-cell black text-base">♣</div>
                      <div className="ab-header-cell red text-base">
                        <img src="/icons/heart.png" alt="Heart" className="w-[18px] h-[18px] object-contain inline-block" />
                      </div>
                      <div className="ab-header-cell red text-base">♦</div>
                    </div>
                    <div className="ab-dual-content cols-4">
                      <div className="ab-dark-btn" onClick={() => handleBet('Spade (Opening Card)', '3.80')}>
                        <LockIcon />
                      </div>
                      <div className="ab-dark-btn" onClick={() => handleBet('Club (Opening Card)', '3.80')}>
                        <LockIcon />
                      </div>
                      <div className="ab-dark-btn" onClick={() => handleBet('Heart (Opening Card)', '3.80')}>
                        <LockIcon />
                      </div>
                      <div className="ab-dark-btn" onClick={() => handleBet('Diamond (Opening Card)', '3.80')}>
                        <LockIcon />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Row 3: 13 Card Tokens Grid (A through K) ── */}
                <div className="ab-cards-row-card">
                  <div className="ab-cards-grid-13">
                    {CARD_RANKS.map((rank) => (
                      <div
                        key={rank}
                        className="ab-card-token"
                        onClick={() => handleBet(`Card ${rank}`, '12.00')}
                      >
                        <span className="token-rank">{rank}</span>
                        <div className="token-lock">
                          <LockIcon className="w-3.5 h-3.5 fill-white" />
                        </div>
                        <div className="token-suits-row">
                          <span className="s-black flex items-center justify-center">
                            <img src="/icons/spade.png" alt="♠" className="w-[10px] h-[10px] object-contain inline-block" />
                          </span>
                          <span className="s-red flex items-center justify-center">
                            <img src="/icons/heart.png" alt="♥" className="w-[10px] h-[10px] object-contain inline-block" />
                          </span>
                          <span className="s-black">♣</span>
                          <span className="s-red">♦</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Last Result Section ── */}
              <CasinoLastResults
                title="Last Result"
                viewAllLink="/casino-results/ab20"
                results={LAST_RESULTS}
                renderResult={(res, idx) => (
                  <span
                    key={res.id || idx}
                    className={`result result-${res.winner.toLowerCase()}`}
                    onClick={() => setSelectedResult(res)}
                    title={`Round: ${res.roundId} | Winner: ${res.winner === 'A' ? 'Andar' : 'Bahar'}`}
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

            {/* ── 20-20 Andar Bahar Rules Modal ── */}
            {showRules && (
              <CommonModal
                show={showRules}
                onClose={() => setShowRules(false)}
                title="20-20 Andar Bahar — Game Rules"
                position="center"
                showFooter={true}
              >
                <div style={{ padding: '14px', lineHeight: 1.6, fontSize: '13px', color: '#334155' }}>
                  <h6 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Game Overview</h6>
                  <p>
                    <strong>20-20 Andar Bahar</strong> is played with a single deck of 52 cards. An opening <strong>Joker Card</strong> is dealt first.
                  </p>
                  <p style={{ marginTop: '8px' }}>
                    Cards are then dealt alternatively to <strong>Andar (A)</strong> and <strong>Bahar (B)</strong> until a matching card rank is revealed.
                  </p>
                  <h6 style={{ fontWeight: 800, color: '#0f172a', marginTop: '12px', marginBottom: '8px' }}>Betting Types</h6>
                  <ul style={{ paddingLeft: '20px', marginBottom: '10px' }}>
                    <li><strong>Andar (A) & Bahar (B):</strong> Main bet on which side gets the matching rank card first.</li>
                    <li><strong>1st Card:</strong> Bet on the matching card appearing on the 1st card dealt.</li>
                    <li><strong>Odd / Even:</strong> Predict whether the total count of cards dealt is Odd or Even.</li>
                    <li><strong>4 Suits:</strong> Bet on ♠, ♣, ♥, or ♦ of the opening card.</li>
                    <li><strong>Card Value (A – K):</strong> Exact rank of the opening card.</li>
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
                <div className="ab20-result-modal">
                  <div className="ab20-result-round-header">
                    <span>Round ID: <strong>{selectedResult.roundId}</strong></span>
                    <span className={`ab20-result-winner winner-${selectedResult.winner.toLowerCase()}`}>
                      Winner: {selectedResult.winner === 'A' ? 'Andar (A)' : 'Bahar (B)'}
                    </span>
                  </div>
                  <div className="ab20-result-details-grid">
                    <div className="ab20-detail-box">
                      <span className="ab20-detail-label">Joker Card</span>
                      <span className="ab20-detail-val">{selectedResult.joker}</span>
                    </div>
                    <div className="ab20-detail-box">
                      <span className="ab20-detail-label">Winning Card</span>
                      <span className="ab20-detail-val">{selectedResult.winCard}</span>
                    </div>
                    <div className="ab20-detail-box">
                      <span className="ab20-detail-label">Cards Dealt</span>
                      <span className="ab20-detail-val">{selectedResult.cardsCount}</span>
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
