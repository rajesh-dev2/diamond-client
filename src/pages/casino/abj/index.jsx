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


/* ── 13 Card Values Config (A through K) ── */
const CARD_RANKS = [
  'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'
]

const INITIAL_MARKET = {
  playerA: {
    sa: { name: 'Player A (SA)', odds: '15', volume: '15', suspended: false },
    firstBet: { name: 'Player A First Bet', odds: '2', volume: '2', suspended: false },
    secondBet: { name: 'Player A Second Bet', odds: '0', volume: '0', suspended: true },
  },
  playerB: {
    sb: { name: 'Player B (SB)', odds: '15', volume: '15', suspended: false },
    firstBet: { name: 'Player B First Bet', odds: '2', volume: '2', suspended: false },
    secondBet: { name: 'Player B Second Bet', odds: '0', volume: '0', suspended: true },
  },
  odd: { name: 'ODD', odds: '1.83', suspended: false },
  even: { name: 'EVEN', odds: '2.12', suspended: false },
  suits: [
    { key: 'spade', name: 'Spade', odds: '3.85', suspended: false, icon: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/icons/spade.png' },
    { key: 'club', name: 'Club', odds: '3.85', suspended: false, icon: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/icons/club.png' },
    { key: 'heart', name: 'Heart', odds: '3.85', suspended: false, icon: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/icons/heart.png' },
    { key: 'diamond', name: 'Diamond', odds: '3.85', suspended: false, icon: 'https://versionobj.ecoassetsservice.com/v106/static/front/img/icons/diamond.png' },
  ],
}

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
  const [market] = useState(INITIAL_MARKET)

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
              {/* ── Casino Table (Andar Bahar 2 New UI) ── */}
              <div className="casino-table">
                {/* ── Row 1: Player A & Player B Bets ── */}
                <div className="casino-table-full-box">
                  {/* Player A Bets */}
                  <div className="playera-bets">
                    <div className="playera-title">A</div>
                    <div
                      className="player-sa"
                      onClick={() => !market.playerA.sa.suspended && handleBet(market.playerA.sa.name, market.playerA.sa.odds)}
                    >
                      <div className="player-sa-box">
                        <div className="casino-odds">SA</div>
                        <div className="casino-volume ">{market.playerA.sa.volume}</div>
                      </div>
                      <div className="casino-nation-book text-center"></div>
                    </div>
                    <div
                      className="player-bet"
                      onClick={() => !market.playerA.firstBet.suspended && handleBet(market.playerA.firstBet.name, market.playerA.firstBet.odds)}
                    >
                      <div className="player-bet-box">
                        <div className="casino-odds">First Bet</div>
                        <div className="casino-volume ">{market.playerA.firstBet.volume}</div>
                      </div>
                      <div className="casino-nation-book text-center"></div>
                    </div>
                    <div
                      className="player-bet"
                      onClick={() => !market.playerA.secondBet.suspended && handleBet(market.playerA.secondBet.name, market.playerA.secondBet.odds)}
                    >
                      <div className={`player-bet-box ${market.playerA.secondBet.suspended ? 'suspended-box' : ''}`}>
                        <div className="casino-odds">Second Bet</div>
                        <div className="casino-volume ">{market.playerA.secondBet.volume}</div>
                      </div>
                      <div className="casino-nation-book text-center"></div>
                    </div>
                    <div className="playera-title">A</div>
                  </div>

                  {/* Player B Bets */}
                  <div className="playera-bets">
                    <div className="playera-title">B</div>
                    <div
                      className="player-sa"
                      onClick={() => !market.playerB.sb.suspended && handleBet(market.playerB.sb.name, market.playerB.sb.odds)}
                    >
                      <div className="player-sa-box">
                        <div className="casino-odds">SB</div>
                        <div className="casino-volume ">{market.playerB.sb.volume}</div>
                      </div>
                      <div className="casino-nation-book text-center"></div>
                    </div>
                    <div
                      className="player-bet"
                      onClick={() => !market.playerB.firstBet.suspended && handleBet(market.playerB.firstBet.name, market.playerB.firstBet.odds)}
                    >
                      <div className="player-bet-box">
                        <div className="casino-odds">First Bet</div>
                        <div className="casino-volume ">{market.playerB.firstBet.volume}</div>
                      </div>
                      <div className="casino-nation-book text-center"></div>
                    </div>
                    <div
                      className="player-bet"
                      onClick={() => !market.playerB.secondBet.suspended && handleBet(market.playerB.secondBet.name, market.playerB.secondBet.odds)}
                    >
                      <div className={`player-bet-box ${market.playerB.secondBet.suspended ? 'suspended-box' : ''}`}>
                        <div className="casino-odds">Second Bet</div>
                        <div className="casino-volume ">{market.playerB.secondBet.volume}</div>
                      </div>
                      <div className="casino-nation-book text-center"></div>
                    </div>
                    <div className="playera-title">B</div>
                  </div>
                </div>

                {/* ── Row 2: ODD/EVEN & 4 Suits ── */}
                <div className="casino-table-box mt-3">
                  <div className="casino-table-left-box">
                    <div
                      className="ab2-box"
                      onClick={() => !market.odd.suspended && handleBet(market.odd.name, market.odd.odds)}
                    >
                      <div className="casino-odds text-center">ODD</div>
                      <div className={`casino-odds-box back ${market.odd.suspended ? 'suspended-box' : ''}`}>
                        <span className="casino-odds">{market.odd.suspended ? '0' : market.odd.odds}</span>
                      </div>
                      <div className="casino-nation-book text-center"></div>
                    </div>
                    <div
                      className="ab2-box"
                      onClick={() => !market.even.suspended && handleBet(market.even.name, market.even.odds)}
                    >
                      <div className="casino-odds text-center">EVEN</div>
                      <div className={`casino-odds-box back ${market.even.suspended ? 'suspended-box' : ''}`}>
                        <span className="casino-odds">{market.even.suspended ? '0' : market.even.odds}</span>
                      </div>
                      <div className="casino-nation-book text-center"></div>
                    </div>
                  </div>

                  <div className="casino-table-right-box">
                    {market.suits.map((suit) => (
                      <div
                        key={suit.key}
                        className="ab2-box"
                        onClick={() => !suit.suspended && handleBet(suit.name, suit.odds)}
                      >
                        <div className="casino-odds text-center">
                          <img src={suit.icon} alt={suit.name} />
                        </div>
                        <div className={`casino-odds-box back ${suit.suspended ? 'suspended-box' : ''}`}>
                          <span className="casino-odds">{suit.suspended ? '0' : suit.odds}</span>
                        </div>
                        <div className="casino-nation-book text-center"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Row 3: 13 Card Ranks ── */}
                <div className="casino-table-full-box ab2cards mt-3">
                  {CARD_RANKS.map((rank) => (
                    <div
                      key={rank}
                      className="card-odd-box"
                      onClick={() => handleBet(`Card ${rank}`, '12.00')}
                    >
                      <div className="suspended-box">
                        <img
                          src={`https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/${rank}.png`}
                          alt={rank}
                          onError={(e) => {
                            e.currentTarget.src = '/img/game-card.png'
                          }}
                        />
                      </div>
                      <div className="casino-nation-book"></div>
                    </div>
                  ))}
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
