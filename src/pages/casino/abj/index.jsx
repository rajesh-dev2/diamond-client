/**
 * Andar Bahar 2 (abj)
 * ───────────────────
 * Live casino Andar Bahar 2 page matching the live DiamondExch interface:
 *   • Top video stream with live dealing cards overlay (Row A & Row B) & FlipClock
 *   • Row 1: Main A vs B (SA/SB, First Bet, Second Bet) with yellow highlighted borders
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

// Inline Lock SVG icon matching standard casino lock icon
function LockIcon({ className = 'ab-lock-icon' }) {
  return (
    <svg className={className} viewBox="0 0 448 512" fill="currentColor">
      <path d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zM264 392c0 22.1-17.9 40-40 40s-40-17.9-40-40v-48c0-22.1 17.9-40 40-40s40 17.9 40 40v48zm32-168H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z" />
    </svg>
  )
}

/* ── Live Overlay Stream Cards Data (Demonstrating Live Dealing) ── */
const STREAM_DEALING_STATE = {
  jokerCard: {
    rank: 'A',
    suit: '♣',
    color: 'black',
  },
  andarCards: [
    { rank: 'J', suit: '♠', color: 'black' },
    { rank: '4', suit: '♠', color: 'black' },
  ],
  baharCards: [
    { rank: '2', suit: '♠', color: 'black' },
    { rank: '2', suit: '♣', color: 'black' },
    { rank: '7', suit: '♣', color: 'black' },
  ],
}


/* ── 13 Card Values Config (Andar & Bahar Deal State with Suspended Support) ── */
const ANDAR_CARDS = [
  { id: 1,  rank: 'A',  img: '0.jpg',  suspended: false },
  { id: 2,  rank: '2',  img: '0.jpg',  suspended: false },
  { id: 3,  rank: '3',  img: '3.jpg',  suspended: true },
  { id: 4,  rank: '4',  img: '0.jpg',  suspended: false },
  { id: 5,  rank: '5',  img: '5.jpg',  suspended: true },
  { id: 6,  rank: '6',  img: '0.jpg',  suspended: false },
  { id: 7,  rank: '7',  img: '0.jpg',  suspended: false },
  { id: 8,  rank: '8',  img: '0.jpg',  suspended: false },
  { id: 9,  rank: '9',  img: '0.jpg',  suspended: false },
  { id: 10, rank: '10', img: '0.jpg',  suspended: false },
  { id: 11, rank: 'J',  img: '0.jpg',  suspended: false },
  { id: 12, rank: 'Q',  img: '0.jpg',  suspended: false },
  { id: 13, rank: 'K',  img: '0.jpg',  suspended: false },
]

const BAHAR_CARDS = [
  { id: 1,  rank: 'A',  img: '21.jpg', suspended: true },
  { id: 2,  rank: '2',  img: '22.jpg', suspended: true },
  { id: 3,  rank: '3',  img: '0.jpg',  suspended: false },
  { id: 4,  rank: '4',  img: '0.jpg',  suspended: false },
  { id: 5,  rank: '5',  img: '0.jpg',  suspended: false },
  { id: 6,  rank: '6',  img: '0.jpg',  suspended: false },
  { id: 7,  rank: '7',  img: '0.jpg',  suspended: false },
  { id: 8,  rank: '8',  img: '0.jpg',  suspended: false },
  { id: 9,  rank: '9',  img: '0.jpg',  suspended: false },
  { id: 10, rank: '10', img: '0.jpg',  suspended: false },
  { id: 11, rank: 'J',  img: '0.jpg',  suspended: false },
  { id: 12, rank: 'Q',  img: '32.jpg', suspended: true },
  { id: 13, rank: 'K',  img: '0.jpg',  suspended: false },
]

/* ── Last 10 Results (B, B, A, B, A, B, A, A, A, B) ───────────── */
const LAST_RESULTS = [
  { id: 1,  winner: 'B', roundId: '124260916125354', cardsCount: 8,  joker: '9♥', winCard: '9♦' },
  { id: 2,  winner: 'B', roundId: '124260916125353', cardsCount: 4,  joker: 'K♠', winCard: 'K♥' },
  { id: 3,  winner: 'A', roundId: '124260916125352', cardsCount: 7,  joker: '4♦', winCard: '4♣' },
  { id: 4,  winner: 'B', roundId: '124260916125351', cardsCount: 6,  joker: 'J♣', winCard: 'J♠' },
  { id: 5,  winner: 'A', roundId: '124260916125350', cardsCount: 3,  joker: '2♥', winCard: '2♦' },
  { id: 6,  winner: 'B', roundId: '124260916125349', cardsCount: 10, joker: '8♠', winCard: '8♥' },
  { id: 7,  winner: 'A', roundId: '124260916125348', cardsCount: 5,  joker: 'Q♦', winCard: 'Q♣' },
  { id: 8,  winner: 'A', roundId: '124260916125347', cardsCount: 1,  joker: '7♣', winCard: '7♠' },
  { id: 9,  winner: 'A', roundId: '124260916125346', cardsCount: 9,  joker: 'A♥', winCard: 'A♦' },
  { id: 10, winner: 'B', roundId: '124260916125345', cardsCount: 4,  joker: '10♠', winCard: '10♦' },
]

export default function Abj() {
  const [showRules, setShowRules] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)
  const [isMuted, setIsMuted] = useState(true)
  const [roundId] = useState('124260916125354')
  const [streamCards] = useState(STREAM_DEALING_STATE)

  return (
    <CasinoLayout
      title="ANDAR BAHAR 2"
      roundId={roundId}
      rulesLink="#rules"
      onRulesClick={() => setShowRules(true)}
    >
      {({ onOddClick }) => {
        const handleBet = (runnerName, odds = '1.98') => {
          onOddClick({ name: runnerName, back: odds }, 'back')
        }

        return (
          <div className="casino-page-container abj-page">
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
                    src={`/newmediaplayer/abj/4a4fdf0e-91d9-4d5e-a8fe-ab1ac5af3a81?ip=103.198.173.38&muted=${isMuted ? 1 : 0}`}
                    title="Andar Bahar 2 Live Stream"
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
              {/* ── Casino Table (Andar Bahar 13-Card Board Table) ── */}
              <div className="casino-table">
                <div className="casino-table-box">
                  {/* ANDAR Box */}
                  <div className="andar-box">
                    <div
                      className="ab-title"
                      onClick={() => handleBet('Andar (A)', '1.98')}
                    >
                      ANDAR
                    </div>
                    <div className="ab-cards">
                      {ANDAR_CARDS.map((card, idx) => (
                        <div
                          key={`andar-${card.id || idx}`}
                          className={`card-odd-box ${card.suspended ? 'suspended' : ''}`.trim()}
                          onClick={() => !card.suspended && handleBet(`Andar Card ${card.rank || idx + 1}`, '12.00')}
                          title={`Andar Card ${card.rank || idx + 1}`}
                        >
                          <div className="card-img-wrap">
                            <img
                              src={`https://versionobj.ecoassetsservice.com/v106/static/front/img/andar-bahar-cards/${card.img}`}
                              alt={`Andar ${card.rank || idx + 1}`}
                              onError={(e) => {
                                e.currentTarget.src = '/img/game-card.png'
                              }}
                            />
                            {card.suspended && (
                              <div className="suspended-box">
                                <LockIcon className="ab-lock-icon" />
                              </div>
                            )}
                          </div>
                          <div className="casino-nation-book"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* BAHAR Box */}
                  <div className="bahar-box">
                    <div
                      className="ab-title"
                      onClick={() => handleBet('Bahar (B)', '1.98')}
                    >
                      BAHAR
                    </div>
                    <div className="ab-cards">
                      {BAHAR_CARDS.map((card, idx) => (
                        <div
                          key={`bahar-${card.id || idx}`}
                          className={`card-odd-box ${card.suspended ? 'suspended' : ''}`.trim()}
                          onClick={() => !card.suspended && handleBet(`Bahar Card ${card.rank || idx + 1}`, '12.00')}
                          title={`Bahar Card ${card.rank || idx + 1}`}
                        >
                          <div className="card-img-wrap">
                            <img
                              src={`https://versionobj.ecoassetsservice.com/v106/static/front/img/andar-bahar-cards/${card.img}`}
                              alt={`Bahar ${card.rank || idx + 1}`}
                              onError={(e) => {
                                e.currentTarget.src = '/img/game-card.png'
                              }}
                            />
                            {card.suspended && (
                              <div className="suspended-box">
                                <LockIcon className="ab-lock-icon" />
                              </div>
                            )}
                          </div>
                          <div className="casino-nation-book"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Casino Remark Marquee ── */}
                <div className="casino-remark mt-1">
                  <marquee scrollamount="3">
                    Payout : Bahar 1st Card 25% and All Other Andar-Bahar Cards 100%.
                  </marquee>
                </div>
              </div>

              {/* ── Last Result Section ── */}
              <CasinoLastResults
                title="Last Result"
                viewAllLink="/casino-results/abj"
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

            {/* ── Andar Bahar 2 Rules Modal ── */}
            {showRules && (
              <CommonModal
                show={showRules}
                onClose={() => setShowRules(false)}
                title="Andar Bahar 2 — Game Rules"
                position="center"
                showFooter={true}
              >
                <div style={{ padding: '14px', lineHeight: 1.6, fontSize: '13px', color: '#334155' }}>
                  <h6 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Game Overview</h6>
                  <p>
                    <strong>Andar Bahar 2</strong> is a standard card game where an opening <strong>Joker Card</strong> is dealt first.
                  </p>
                  <p style={{ marginTop: '8px' }}>
                    Cards are then dealt alternatively to <strong>Andar (A)</strong> and <strong>Bahar (B)</strong> until a card of the same face value is dealt.
                  </p>
                  <h6 style={{ fontWeight: 800, color: '#0f172a', marginTop: '12px', marginBottom: '8px' }}>Betting Types</h6>
                  <ul style={{ paddingLeft: '20px', marginBottom: '10px' }}>
                    <li><strong>SA / SB:</strong> Main bet on Andar or Bahar.</li>
                    <li><strong>First Bet / Second Bet:</strong> Special payout bets depending on card dealing sequence.</li>
                    <li><strong>Odd / Even:</strong> Predict whether the opening Joker is an Odd or Even ranked card.</li>
                    <li><strong>4 Suits:</strong> Bet on ♠, ♣, ♥, or ♦ of the opening card.</li>
                    <li><strong>Card Rank (A – K):</strong> Exact value prediction of the opening Joker card.</li>
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
                <div className="abj-result-modal">
                  <div className="abj-result-round-header">
                    <span>Round ID: <strong>{selectedResult.roundId}</strong></span>
                    <span className={`abj-result-winner winner-${selectedResult.winner.toLowerCase()}`}>
                      Winner: {selectedResult.winner === 'A' ? 'Andar (A)' : 'Bahar (B)'}
                    </span>
                  </div>
                  <div className="abj-result-details-grid">
                    <div className="abj-detail-box">
                      <span className="abj-detail-label">Joker Card</span>
                      <span className="abj-detail-val">{selectedResult.joker}</span>
                    </div>
                    <div className="abj-detail-box">
                      <span className="abj-detail-label">Winning Card</span>
                      <span className="abj-detail-val">{selectedResult.winCard}</span>
                    </div>
                    <div className="abj-detail-box">
                      <span className="abj-detail-label">Cards Dealt</span>
                      <span className="abj-detail-val">{selectedResult.cardsCount}</span>
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
