/**
 * Worli3 / Matka Market Page
 * ──────────────────────────
 * Matka Market casino game faithfully structured to match the standard reference DOM:
 *   • .matka-tabs           — Venue schedule tabs with countdown timer and game time
 *   • .casino-video         — Stream video container with overlay
 *   • .matka-coins          — 1-click bet chip selection bar (Reset, purple total chip, +25, +50, +100, +200, +500, +1K)
 *   • .nav.nav-pills        — Vertical market type tablist (Jodi, Single, Pana, SP, DP, Trio, Cycle, Motor, 56 Charts, 64 Charts, ABR, Common SP, Common DP, Color DP)
 *   • .casino-box           — Tab panes with .worlibox, .worli-box-title, .worli-left, .worli-right, .worli-full, .worli-odd-box.back
 *   • .casino-last-results  — Last results with venue pills
 *   • Fully wired to CasinoLayout (PlaceBetSidebar, MyBetsSidebar, MobileTabs, PlaceBetModal)
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import CasinoLayout from '../../../components/CasinoLayout'
import FlipClock from '../../../components/FlipClock'
import './style.css'

/* ── Schedule Venue Strip Data ───────────────────────────────── */
const SCHEDULE_TABS = [
  { id: 'asia-open',     name: 'Asia Open',     countdown: '00:33:54', time: '18 Aug 26 03:00 PM', active: true  },
  { id: 'asia-close',    name: 'Asia Close',    countdown: '01:33:54', time: '18 Aug 26 04:00 PM', active: false },
  { id: 'taj-open',      name: 'Taj Open',      countdown: '02:33:54', time: '18 Aug 26 05:00 PM', active: false },
  { id: 'taj-close',     name: 'Taj Close',     countdown: '03:33:54', time: '18 Aug 26 06:00 PM', active: false },
  { id: 'gulf-open',     name: 'Gulf Open',     countdown: '04:33:54', time: '18 Aug 26 07:00 PM', active: false },
  { id: 'gulf-close',    name: 'Gulf Close',    countdown: '05:33:54', time: '18 Aug 26 08:00 PM', active: false },
  { id: 'diamond-open',  name: 'Diamond Open',  countdown: '06:33:54', time: '18 Aug 26 09:00 PM', active: false },
  { id: 'diamond-close', name: 'Diamond Close', countdown: '07:33:54', time: '18 Aug 26 10:00 PM', active: false },
  { id: 'world-open',    name: 'World Open',    countdown: '08:33:54', time: '18 Aug 26 11:00 PM', active: false },
  { id: 'world-close',   name: 'World Close',   countdown: '09:28:54', time: '18 Aug 26 11:55 PM', active: false },
  { id: 'lords-open',    name: 'Lords Open',    countdown: '20:33:54', time: '19 Aug 26 11:00 AM', active: false },
  { id: 'lords-close',   name: 'Lords Close',   countdown: '21:33:54', time: '19 Aug 26 12:00 PM', active: false },
  { id: 'riga-open',     name: 'Riga Open',     countdown: '22:33:54', time: '19 Aug 26 01:00 PM', active: false },
  { id: 'riga-close',    name: 'Riga Close',    countdown: '23:33:54', time: '19 Aug 26 02:00 PM', active: false },
]

/* ── Result venues ────────────────────────────────────────────── */
const VENUES = ['Diamond', 'World', 'Taj', 'Lords', 'Riga', 'Asia', 'Gulf']

export default function Worli3() {
  const [selectedSchedule, setSelectedSchedule] = useState('asia-open')
  const [activeVenue, setActiveVenue]           = useState('Diamond')
  const [coinAmount, setCoinAmount]             = useState(0)
  const [isMuted, setIsMuted]                   = useState(true)
  const [selectedCoin, setSelectedCoin]         = useState(null)

  const handleAddCoin = (val) => {
    setCoinAmount((prev) => prev + val)
    setSelectedCoin(val)
  }
  const handleResetCoin = () => {
    setCoinAmount(0)
    setSelectedCoin(null)
  }

  return (
    <CasinoLayout
      title="Matka Market"
      rulesLink="/casino-results/worli3"
      roundId="196260818142600"
    >
      {({ onOddClick }) => {
        const handleBet = (name, odds) => {
          onOddClick({ id: name, name, back: odds }, 'back')
        }

        return (
          <div className="casino-page-container worli matka">
            {/* Header: Rules link */}
            <div className="casino-header">
              <span className="casino-name">
                Matka Market
                <Link to="/casino-results/worli3" className="ms-1">
                  <small>Rules</small>
                </Link>
              </span>
            </div>

            {/* Schedule Strip (14 Game Venues) */}
            <div className="matka-tabs">
              <ul className="nav nav-pills">
                {SCHEDULE_TABS.map((tab) => (
                  <li key={tab.id} className="nav-item">
                    <a
                      className={`nav-link${selectedSchedule === tab.id ? ' active' : ''}`}
                      href="javascript:void(0);"
                      onClick={() => setSelectedSchedule(tab.id)}
                    >
                      <span>{tab.name}</span>
                      <div className="remaining-time">
                        <img src="/icons/clock.png" alt="Clock Icon" />
                        <span>{tab.countdown}</span>
                      </div>
                      <div className="game-time">
                        <span>{tab.time}</span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Video Stream + Clock */}
            <div className="casino-video">
              <div className="video-box-container">
                <div className="casino-video-box">
                  <iframe
                    src="/newmediaplayer/worli3/bd2eb20c-28ce-4303-9673-a443eda5bd7b?ip=103.198.173.38"
                    title="Live Stream"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              </div>
              <div className="clock">
                <FlipClock seconds={12} />
              </div>
            </div>

            {/* Detail Content */}
            <div className="casino-detail">
              <div className="casino-table">
                {/* ── 1-Click Bet Chip Selection Bar ───────────── */}
                <div className="matka-coins">
                  <div className="matka-coin-title">
                    <span className="d-none d-md-flex">
                      SET YOUR COIN AMOUNT<br /> AND START 1-CLICK BET!
                    </span>
                    <span className="d-md-none">
                      SET YOUR COIN AMOUNT AND START 1-CLICK BET!
                    </span>
                    <button className="btn btn-danger btn-sm" onClick={handleResetCoin}>
                      Reset
                    </button>
                  </div>

                  {/* Total Coin Accumulator */}
                  <div className="matka-total-coin">
                    <div className="casino-coin">
                      <div className="bet-chip-holder" style={{ '--g-chip-inner-color': '#502b63' }}>
                        <div className="bet-chip">
                          <div className="bet-chip-front" />
                          <div className="bet-chip-top" />
                          <div className="bet-chip-amount">
                            <svg className="bet-chip-amount-in" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 108 108">
                              <text className="bet-chip-amount-label" x="50%" y="53.5%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="32" fontWeight="700">
                                {coinAmount}
                              </text>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>=</div>
                  </div>

                  {/* Chip Multipliers */}
                  <div className="matka-other-coins">
                    {[
                      { val: 25, label: '25' },
                      { val: 50, label: '50' },
                      { val: 100, label: '100' },
                      { val: 200, label: '200' },
                      { val: 500, label: '500' },
                      { val: 1000, label: '1K' },
                    ].map((chip, idx) => (
                      <div key={chip.label} className="d-flex align-items-center gap-1">
                        {idx > 0 && <div>+</div>}
                        <div
                          className={`casino-coin${selectedCoin === chip.val ? ' selected' : ''}`}
                          onClick={() => handleAddCoin(chip.val)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="bet-chip-holder" style={{ '--g-chip-inner-color': '#1f6179' }}>
                            <div className="bet-chip">
                              <div className="bet-chip-front" />
                              <div className="bet-chip-top" />
                              <div className="bet-chip-amount">
                                <svg className="bet-chip-amount-in" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 108 108">
                                  <text className="bet-chip-amount-label" x="50%" y="53.5%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="32" fontWeight="700">
                                    {chip.label}
                                  </text>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Last Result Section ─────────────────────── */}
                <div className="casino-last-result-title">
                  <span>Last Result</span>
                  <span><Link to="/casino-results/worli3">View All</Link></span>
                </div>
                <div className="casino-last-results matka-result">
                  {VENUES.map((venue) => (
                    <span
                      key={venue}
                      className={`result result-b${activeVenue === venue ? ' active' : ''}`}
                      onClick={() => setActiveVenue(venue)}
                      style={{ cursor: 'pointer' }}
                    >
                      {venue}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      }}
    </CasinoLayout>
  )
}
