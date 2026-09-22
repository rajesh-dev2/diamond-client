/**
 * Dragon Tiger 1-Day (dt6)
 * ─────────────────────────────
 * Live casino Dragon Tiger 1-Day page matching reference HTML and screenshot:
 *   • Video Stream + FlipClock
 *   • Table 1: Dragon & Tiger (Back / Lay) + Pair right-box
 *   • Table 2: Dragon & Tiger (Even / Odd) + Dragon & Tiger (Red / Black)
 *   • Table 3: Full-width Dragon & Tiger with ♠ ♥ ♣ ♦ suit columns
 *   • Last Results + Rules Modal
 */

import { useState } from 'react'
import CasinoLayout from '../../../components/CasinoLayout'
import FlipClock from '../../../components/FlipClock'
import CommonModal from '../../../components/Modal'
import CasinoLastResults from '../../../components/CasinoLastResults'
import CasinoVideoCards from '../../../components/CasinoVideoCards'
import './style.css'

/* ── Market Data ────────────────────────────────────────────────── */
const INITIAL_MARKET = {
  // Table 1 — Back / Lay
  dragon: {
    back: 1.05,
    lay: 1.07,
    suspendedBack: false,
    suspendedLay: false,
  },
  tiger: {
    back: 0,
    lay: 0,
    suspendedBack: true,
    suspendedLay: true,
  },
  pair: {
    odds: 12,
    suspended: true,
  },

  // Table 2 — Even / Odd
  dragonEven: { back: 0, suspended: true },
  dragonOdd:  { back: 0, suspended: true },
  tigerEven:  { back: 2.07, suspended: false },
  tigerOdd:   { back: 1.83, suspended: false },

  // Table 2 — Red / Black
  dragonRed:   { back: 0,    suspended: true },
  dragonBlack: { back: 0,    suspended: true },
  tigerRed:    { back: 2,    suspended: false },
  tigerBlack:  { back: 1.93, suspended: false },

  // Table 3 — Suits
  dragonSpade:   { back: 0,    suspended: true },
  dragonHeart:   { back: 0,    suspended: true },
  dragonClub:    { back: 0,    suspended: true },
  dragonDiamond: { back: 0,    suspended: true },
  tigerSpade:    { back: 3.72, suspended: false },
  tigerHeart:    { back: 3.72, suspended: false },
  tigerClub:     { back: 3.72, suspended: false },
  tigerDiamond:  { back: 4,    suspended: false },
}

/* ── Last 10 Results ────────────────────────────────────────────── */
const LAST_RESULTS = [
  { id: 1,  winner: 'D', roundId: '203260922120001', dragon: 'K♠',  tiger: '7♥'  },
  { id: 2,  winner: 'T', roundId: '203260922120002', dragon: '4♦',  tiger: 'A♠'  },
  { id: 3,  winner: 'D', roundId: '203260922120003', dragon: 'Q♣',  tiger: '9♦'  },
  { id: 4,  winner: 'T', roundId: '203260922120004', dragon: '3♥',  tiger: 'J♣'  },
  { id: 5,  winner: 'D', roundId: '203260922120005', dragon: '10♠', tiger: '5♥'  },
  { id: 6,  winner: 'D', roundId: '203260922120006', dragon: '8♣',  tiger: '2♦'  },
  { id: 7,  winner: 'T', roundId: '203260922120007', dragon: '6♥',  tiger: 'K♠'  },
  { id: 8,  winner: 'D', roundId: '203260922120008', dragon: 'A♦',  tiger: '3♣'  },
  { id: 9,  winner: 'T', roundId: '203260922120009', dragon: '7♠',  tiger: 'Q♥'  },
  { id: 10, winner: 'D', roundId: '203260922120010', dragon: 'J♦',  tiger: '4♠'  },
]

export default function Dt6() {
  const [showRules, setShowRules] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)
  const [isMuted, setIsMuted] = useState(true)
  const [roundId] = useState('203260922120011')
  const [market] = useState(INITIAL_MARKET)

  return (
    <CasinoLayout
      title="1 DAY DRAGON TIGER"
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
          <div className="casino-page-container dt6-page">
            {/* Video Stream Section */}
            <div className="casino-video">
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

              <div className="video-box-container">
                <div className="casino-video-box">
                  <iframe
                    src={`/newmediaplayer/dt6/4a4fdf0e-91d9-4d5e-a8fe-ab1ac5af3a81?ip=103.198.173.38&muted=${isMuted ? 1 : 0}`}
                    title="1 Day Dragon Tiger Live Stream"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              </div>

              <CasinoVideoCards />

              <div className="clock">
                <FlipClock seconds={21} />
              </div>
            </div>

            {/* Casino Detail Section */}
            <div className="casino-detail">
              <div className="casino-table">

                {/* Table 1: Back/Lay + Pair */}
                <div className="casino-table-box">
                  <div className="casino-table-left-box">
                    <div className="casino-table-header">
                      <div className="casino-nation-detail"></div>
                      <div className="casino-odds-box back">Back</div>
                      <div className="casino-odds-box lay">Lay</div>
                    </div>
                    <div className="casino-table-body">
                      <div className="casino-table-row">
                        <div className="casino-nation-detail">
                          <div className="casino-nation-name">Dragon</div>
                        </div>
                        <div
                          className={`casino-odds-box back ${market.dragon.suspendedBack ? 'suspended-box' : ''}`}
                          onClick={() => handleBetClick('Dragon Back', market.dragon.back, 'back', market.dragon.suspendedBack)}
                        >
                          <span className="casino-odds">{market.dragon.back || 0}</span>
                        </div>
                        <div
                          className={`casino-odds-box lay ${market.dragon.suspendedLay ? 'suspended-box' : ''}`}
                          onClick={() => handleBetClick('Dragon Lay', market.dragon.lay, 'lay', market.dragon.suspendedLay)}
                        >
                          <span className="casino-odds">{market.dragon.lay || 0}</span>
                        </div>
                      </div>
                      <div className="casino-table-row">
                        <div className="casino-nation-detail">
                          <div className="casino-nation-name">Tiger</div>
                        </div>
                        <div
                          className={`casino-odds-box back ${market.tiger.suspendedBack ? 'suspended-box' : ''}`}
                          onClick={() => handleBetClick('Tiger Back', market.tiger.back, 'back', market.tiger.suspendedBack)}
                        >
                          <span className="casino-odds">{market.tiger.back || 0}</span>
                        </div>
                        <div
                          className={`casino-odds-box lay ${market.tiger.suspendedLay ? 'suspended-box' : ''}`}
                          onClick={() => handleBetClick('Tiger Lay', market.tiger.lay, 'lay', market.tiger.suspendedLay)}
                        >
                          <span className="casino-odds">{market.tiger.lay || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="casino-table-right-box dtpair"
                    onClick={() => handleBetClick('Pair', market.pair.odds, 'back', market.pair.suspended)}
                  >
                    <div className="casino-odds text-center">{market.pair.odds}</div>
                    <div className={`casino-odds-box back casino-odds-box-theme ${market.pair.suspended ? 'suspended-box' : ''}`}>
                      <span className="casino-odds">Pair</span>
                    </div>
                  </div>
                </div>

                {/* Table 2: Even/Odd + Red/Black */}
                <div className="casino-table-box mt-3">
                  <div className="casino-table-left-box">
                    <div className="casino-table-header">
                      <div className="casino-nation-detail"></div>
                      <div className="casino-odds-box back">Even</div>
                      <div className="casino-odds-box back">Odd</div>
                    </div>
                    <div className="casino-table-body">
                      <div className="casino-table-row">
                        <div className="casino-nation-detail">
                          <div className="casino-nation-name">Dragon</div>
                        </div>
                        <div
                          className={`casino-odds-box back ${market.dragonEven.suspended ? 'suspended-box' : ''}`}
                          onClick={() => handleBetClick('Dragon Even', market.dragonEven.back, 'back', market.dragonEven.suspended)}
                        >
                          <span className="casino-odds">{market.dragonEven.back || 0}</span>
                        </div>
                        <div
                          className={`casino-odds-box back ${market.dragonOdd.suspended ? 'suspended-box' : ''}`}
                          onClick={() => handleBetClick('Dragon Odd', market.dragonOdd.back, 'back', market.dragonOdd.suspended)}
                        >
                          <span className="casino-odds">{market.dragonOdd.back || 0}</span>
                        </div>
                      </div>
                      <div className="casino-table-row">
                        <div className="casino-nation-detail">
                          <div className="casino-nation-name">Tiger</div>
                        </div>
                        <div
                          className={`casino-odds-box back ${market.tigerEven.suspended ? 'suspended-box' : ''}`}
                          onClick={() => handleBetClick('Tiger Even', market.tigerEven.back, 'back', market.tigerEven.suspended)}
                        >
                          <span className="casino-odds">{market.tigerEven.back || 0}</span>
                        </div>
                        <div
                          className={`casino-odds-box back ${market.tigerOdd.suspended ? 'suspended-box' : ''}`}
                          onClick={() => handleBetClick('Tiger Odd', market.tigerOdd.back, 'back', market.tigerOdd.suspended)}
                        >
                          <span className="casino-odds">{market.tigerOdd.back || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="casino-table-right-box dtredblack">
                    <div className="casino-table-header">
                      <div className="casino-nation-detail"></div>
                      <div className="casino-odds-box back">
                        <span>Red</span>
                        <span className="card-icon ms-1"><span className="card-red">♥</span></span>
                        <span className="card-icon ms-1"><span className="card-red">♦</span></span>
                      </div>
                      <div className="casino-odds-box back">
                        <span>Black</span>
                        <span className="card-icon ms-1"><span className="card-black">♠</span></span>
                        <span className="card-icon ms-1"><span className="card-black">♣</span></span>
                      </div>
                    </div>
                    <div className="casino-table-body">
                      <div className="casino-table-row">
                        <div className="casino-nation-detail">
                          <div className="casino-nation-name">Dragon</div>
                        </div>
                        <div
                          className={`casino-odds-box back ${market.dragonRed.suspended ? 'suspended-box' : ''}`}
                          onClick={() => handleBetClick('Dragon Red', market.dragonRed.back, 'back', market.dragonRed.suspended)}
                        >
                          <span className="casino-odds">{market.dragonRed.back || 0}</span>
                        </div>
                        <div
                          className={`casino-odds-box back ${market.dragonBlack.suspended ? 'suspended-box' : ''}`}
                          onClick={() => handleBetClick('Dragon Black', market.dragonBlack.back, 'back', market.dragonBlack.suspended)}
                        >
                          <span className="casino-odds">{market.dragonBlack.back || 0}</span>
                        </div>
                      </div>
                      <div className="casino-table-row">
                        <div className="casino-nation-detail">
                          <div className="casino-nation-name">Tiger</div>
                        </div>
                        <div
                          className={`casino-odds-box back ${market.tigerRed.suspended ? 'suspended-box' : ''}`}
                          onClick={() => handleBetClick('Tiger Red', market.tigerRed.back, 'back', market.tigerRed.suspended)}
                        >
                          <span className="casino-odds">{market.tigerRed.back || 0}</span>
                        </div>
                        <div
                          className={`casino-odds-box back ${market.tigerBlack.suspended ? 'suspended-box' : ''}`}
                          onClick={() => handleBetClick('Tiger Black', market.tigerBlack.back, 'back', market.tigerBlack.suspended)}
                        >
                          <span className="casino-odds">{market.tigerBlack.back || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table 3: Full-width Suits */}
                <div className="casino-table-full-box dt1day-other-odds mt-3">
                  <div className="casino-table-header">
                    <div className="casino-nation-detail"></div>
                    <div className="casino-odds-box">
                      <span className="card-icon"><span className="card-black">♠</span></span>
                    </div>
                    <div className="casino-odds-box">
                      <span className="card-icon"><span className="card-red">♥</span></span>
                    </div>
                    <div className="casino-odds-box">
                      <span className="card-icon"><span className="card-black">♣</span></span>
                    </div>
                    <div className="casino-odds-box">
                      <span className="card-icon"><span className="card-red">♦</span></span>
                    </div>
                  </div>
                  <div className="casino-table-body">
                    <div className="casino-table-row">
                      <div className="casino-nation-detail">
                        <div className="casino-nation-name">Dragon</div>
                      </div>
                      <div
                        className={`casino-odds-box back ${market.dragonSpade.suspended ? 'suspended-box' : ''}`}
                        onClick={() => handleBetClick('Dragon Spade', market.dragonSpade.back, 'back', market.dragonSpade.suspended)}
                      >
                        <span className="casino-odds">{market.dragonSpade.back || 0}</span>
                      </div>
                      <div
                        className={`casino-odds-box back ${market.dragonHeart.suspended ? 'suspended-box' : ''}`}
                        onClick={() => handleBetClick('Dragon Heart', market.dragonHeart.back, 'back', market.dragonHeart.suspended)}
                      >
                        <span className="casino-odds">{market.dragonHeart.back || 0}</span>
                      </div>
                      <div
                        className={`casino-odds-box back ${market.dragonClub.suspended ? 'suspended-box' : ''}`}
                        onClick={() => handleBetClick('Dragon Club', market.dragonClub.back, 'back', market.dragonClub.suspended)}
                      >
                        <span className="casino-odds">{market.dragonClub.back || 0}</span>
                      </div>
                      <div
                        className={`casino-odds-box back ${market.dragonDiamond.suspended ? 'suspended-box' : ''}`}
                        onClick={() => handleBetClick('Dragon Diamond', market.dragonDiamond.back, 'back', market.dragonDiamond.suspended)}
                      >
                        <span className="casino-odds">{market.dragonDiamond.back || 0}</span>
                      </div>
                    </div>
                    <div className="casino-table-row">
                      <div className="casino-nation-detail">
                        <div className="casino-nation-name">Tiger</div>
                      </div>
                      <div
                        className={`casino-odds-box back ${market.tigerSpade.suspended ? 'suspended-box' : ''}`}
                        onClick={() => handleBetClick('Tiger Spade', market.tigerSpade.back, 'back', market.tigerSpade.suspended)}
                      >
                        <span className="casino-odds">{market.tigerSpade.back || 0}</span>
                      </div>
                      <div
                        className={`casino-odds-box back ${market.tigerHeart.suspended ? 'suspended-box' : ''}`}
                        onClick={() => handleBetClick('Tiger Heart', market.tigerHeart.back, 'back', market.tigerHeart.suspended)}
                      >
                        <span className="casino-odds">{market.tigerHeart.back || 0}</span>
                      </div>
                      <div
                        className={`casino-odds-box back ${market.tigerClub.suspended ? 'suspended-box' : ''}`}
                        onClick={() => handleBetClick('Tiger Club', market.tigerClub.back, 'back', market.tigerClub.suspended)}
                      >
                        <span className="casino-odds">{market.tigerClub.back || 0}</span>
                      </div>
                      <div
                        className={`casino-odds-box back ${market.tigerDiamond.suspended ? 'suspended-box' : ''}`}
                        onClick={() => handleBetClick('Tiger Diamond', market.tigerDiamond.back, 'back', market.tigerDiamond.suspended)}
                      >
                        <span className="casino-odds">{market.tigerDiamond.back || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Last Results */}
              <CasinoLastResults
                title="Last Result"
                viewAllLink="/casino-results/dt6"
                results={LAST_RESULTS}
                renderResult={(res, idx) => (
                  <span
                    key={res.id || idx}
                    className={`result result-${res.winner.toLowerCase()}`}
                    onClick={() => setSelectedResult(res)}
                    title={`Round: ${res.roundId} | Dragon: ${res.dragon} | Tiger: ${res.tiger}`}
                  >
                    {res.winner}
                  </span>
                )}
              />
            </div>

            {/* Hidden Matched Bet Table */}
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

            {/* Rules Modal */}
            {showRules && (
              <CommonModal
                show={showRules}
                onClose={() => setShowRules(false)}
                title="1 Day Dragon Tiger — Game Rules"
                position="center"
                showFooter={true}
              >
                <div style={{ padding: '14px', lineHeight: 1.6, fontSize: '13px', color: '#334155' }}>
                  <h6 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Game Overview</h6>
                  <p>
                    <strong>1 Day Dragon Tiger</strong> is a fast-paced card game played with a single 52-card deck.
                    One card is dealt to Dragon and one to Tiger. The higher card wins.
                  </p>
                  <h6 style={{ fontWeight: 800, color: '#0f172a', marginTop: '12px', marginBottom: '8px' }}>Betting Markets</h6>
                  <ul style={{ paddingLeft: '20px', marginBottom: '10px' }}>
                    <li><strong>Dragon / Tiger (Back &amp; Lay):</strong> Bet on which side gets the higher card.</li>
                    <li><strong>Pair:</strong> Both Dragon and Tiger cards are of the same rank.</li>
                    <li><strong>Even / Odd:</strong> Whether the winning card value is Even or Odd.</li>
                    <li><strong>Red / Black:</strong> Bet on the suit colour of the winning card.</li>
                    <li><strong>Suit (&#9824; &#9829; &#9827; &#9830;):</strong> Exact suit prediction for Dragon or Tiger card.</li>
                  </ul>
                </div>
              </CommonModal>
            )}

            {/* Result Detail Modal */}
            {selectedResult && (
              <CommonModal
                show={Boolean(selectedResult)}
                onClose={() => setSelectedResult(null)}
                title="Round Result Details"
                position="center"
                showFooter={true}
              >
                <div className="dt6-result-modal">
                  <div className="dt6-result-round-header">
                    <span>Round ID: <strong>{selectedResult.roundId}</strong></span>
                    <span className={`dt6-result-winner winner-${selectedResult.winner.toLowerCase()}`}>
                      Winner: {selectedResult.winner === 'D' ? 'Dragon' : 'Tiger'}
                    </span>
                  </div>
                  <div className="dt6-result-details-grid">
                    <div className="dt6-detail-box">
                      <span className="dt6-detail-label">Dragon Card</span>
                      <span className="dt6-detail-val">{selectedResult.dragon}</span>
                    </div>
                    <div className="dt6-detail-box">
                      <span className="dt6-detail-label">Tiger Card</span>
                      <span className="dt6-detail-val">{selectedResult.tiger}</span>
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
