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

// ── Worli Datasets ──────────────────────────────────────────────
const DIGIT_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

const JODI_GRID = Array.from({ length: 10 }, (_, row) =>
  Array.from({ length: 10 }, (_, col) => `${row}-${col}`)
)

const SP_PANA_DATA = {
  '1': ['128', '137', '146', '236', '245', '290', '380', '470', '489', '560', '579', '678'],
  '2': ['129', '138', '147', '156', '237', '246', '345', '390', '480', '570', '589', '679'],
  '3': ['120', '139', '148', '157', '238', '247', '256', '346', '490', '580', '670', '689'],
  '4': ['130', '149', '158', '167', '239', '248', '257', '347', '356', '590', '680', '789'],
  '5': ['140', '159', '168', '230', '249', '258', '267', '348', '357', '456', '690', '780'],
  '6': ['123', '150', '169', '178', '240', '259', '268', '349', '358', '367', '457', '790'],
  '7': ['124', '160', '179', '250', '269', '278', '340', '359', '368', '458', '467', '890'],
  '8': ['125', '134', '170', '189', '260', '279', '350', '369', '378', '459', '468', '567'],
  '9': ['126', '135', '180', '234', '270', '289', '360', '379', '450', '469', '478', '568'],
  '0': ['127', '136', '145', '190', '235', '280', '370', '389', '460', '479', '569', '578'],
}

const DP_PANA_DATA = {
  '1': ['100', '119', '155', '227', '335', '344', '399', '588', '669'],
  '2': ['110', '200', '228', '255', '336', '499', '660', '688', '778'],
  '3': ['166', '229', '300', '337', '355', '445', '599', '779', '788'],
  '4': ['112', '220', '266', '338', '400', '446', '455', '699', '770'],
  '5': ['113', '122', '177', '339', '366', '447', '500', '799', '889'],
  '6': ['114', '277', '330', '448', '466', '556', '600', '880', '899'],
  '7': ['115', '133', '188', '223', '377', '449', '557', '566', '700'],
  '8': ['116', '224', '233', '288', '440', '477', '558', '800', '990'],
  '9': ['117', '144', '199', '225', '388', '559', '577', '667', '900'],
  '0': ['118', '226', '244', '299', '334', '488', '550', '668', '677'],
}

const TP_PANA_LIST = ['777', '444', '111', '888', '555', '222', '999', '666', '333', '000']

export default function Worli3() {
  const [selectedSchedule, setSelectedSchedule] = useState('asia-open')
  const [activeVenue, setActiveVenue]           = useState('Diamond')
  const [coinAmount, setCoinAmount]             = useState(0)
  const [isMuted, setIsMuted]                   = useState(true)
  const [selectedCoin, setSelectedCoin]         = useState(null)
  const [activeWorliTab, setActiveWorliTab]     = useState('sp')
  const [activePanaSubTab, setActivePanaSubTab] = useState('sppana')

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

                {/* ── Worli Market Tabs (Vertical Sidebar + Tab Content) ── */}
                <div className="worli-market-tabs-wrapper">
                  {/* Vertical Tab Nav */}
                  <div className="nav nav-pills" role="tablist">
                    {[
                      { key: 'jodi',     label: 'Jodi'      },
                      { key: 'single',   label: 'Single'    },
                      { key: 'pana',     label: 'Pana'      },
                      { key: 'sp',       label: 'SP'        },
                      { key: 'dp',       label: 'DP'        },
                      { key: 'trio',     label: 'Trio'      },
                      { key: 'cycle',    label: 'Cycle'     },
                      { key: 'motor',    label: 'Motor SP'  },
                      { key: 'chart56',  label: '56 Charts' },
                      { key: 'chart64',  label: '64 Charts' },
                      { key: 'abr',      label: 'ABR'       },
                      { key: 'commonsp', label: 'Common SP' },
                      { key: 'commondp', label: 'Common DP' },
                      { key: 'colordp',  label: 'Color DP'  },
                    ].map((t) => (
                      <div key={t.key} className="nav-item">
                        <a
                          role="tab"
                          data-rr-ui-event-key={t.key}
                          id={`worli-tabs-tab-${t.key}`}
                          aria-controls={`worli-tabs-tabpane-${t.key}`}
                          aria-selected={activeWorliTab === t.key}
                          tabIndex={activeWorliTab === t.key ? 0 : -1}
                          className={`nav-link${activeWorliTab === t.key ? ' active' : ''}`}
                          href={`#${t.key}`}
                          onClick={(e) => {
                            e.preventDefault()
                            setActiveWorliTab(t.key)
                          }}
                        >
                          {t.label}
                        </a>
                      </div>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="casino-box tab-content w-100 tab-content">

                    {/* 1. ── JODI Tab Pane ── */}
                    <div
                      role="tabpanel"
                      id="worli-tabs-tabpane-jodi"
                      aria-labelledby="worli-tabs-tab-jodi"
                      className={`fade jodi tab-pane${activeWorliTab === 'jodi' ? ' active show' : ''}`}
                    >
                      <div className="casino-table-full-box">
                        <div className="worlibox">
                          <div className="worli-full">
                            <div className="worli-box-title"><b>90</b></div>
                            {JODI_GRID.map((rowArr, rIdx) => (
                              <div key={rIdx} className="worli-box-row">
                                {rowArr.map((num) => (
                                  <div
                                    key={num}
                                    className="worli-odd-box back"
                                    onClick={() => handleBet(`Jodi-${num}`, 90)}
                                  >
                                    <span className="worli-odd">{num}</span>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. ── SINGLE Tab Pane ── */}
                    <div
                      role="tabpanel"
                      id="worli-tabs-tabpane-single"
                      aria-labelledby="worli-tabs-tab-single"
                      className={`fade single tab-pane${activeWorliTab === 'single' ? ' active show' : ''}`}
                    >
                      <div className="worlibox">
                        <div className="worli-left">
                          <div className="worli-box-title"><b>9.5</b></div>
                          <div className="worli-box-row">
                            {['1', '2', '3', '4', '5'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`Single-${n}`, 9.5)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                          <div className="worli-box-row">
                            {['6', '7', '8', '9', '0'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`Single-${n}`, 9.5)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="worli-right">
                          <div className="worli-box-title"><b>9.5</b></div>
                          <div className="worli-box-row">
                            <div
                              className="worli-odd-box back"
                              onClick={() => handleBet('Line 1', 9.5)}
                            >
                              <span className="worli-odd">Line 1</span>
                              <span className="d-block">1|2|3|4|5</span>
                            </div>
                            <div
                              className="worli-odd-box back"
                              onClick={() => handleBet('ODD', 9.5)}
                            >
                              <span className="worli-odd">ODD</span>
                              <span className="d-block">1|3|5|7|9</span>
                            </div>
                          </div>
                          <div className="worli-box-row">
                            <div
                              className="worli-odd-box back"
                              onClick={() => handleBet('Line 2', 9.5)}
                            >
                              <span className="worli-odd">Line 2</span>
                              <span className="d-block">6|7|8|9|0</span>
                            </div>
                            <div
                              className="worli-odd-box back"
                              onClick={() => handleBet('EVEN', 9.5)}
                            >
                              <span className="worli-odd">EVEN</span>
                              <span className="d-block">2|4|6|8|0</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. ── PANA Tab Pane ── */}
                    <div
                      role="tabpanel"
                      id="worli-tabs-tabpane-pana"
                      aria-labelledby="worli-tabs-tab-pana"
                      className={`fade pana tab-pane${activeWorliTab === 'pana' ? ' active show' : ''}`}
                    >
                      <div className="worlibox">
                        <div className="worli-full">
                          <ul className="nav nav-pills pana-sub-nav">
                            <li className="nav-item">
                              <button
                                className={`nav-link${activePanaSubTab === 'sppana' ? ' active' : ''}`}
                                onClick={() => setActivePanaSubTab('sppana')}
                              >
                                SP PANA(<b>140</b>)
                              </button>
                            </li>
                            <li className="nav-item">
                              <button
                                className={`nav-link${activePanaSubTab === 'dppana' ? ' active' : ''}`}
                                onClick={() => setActivePanaSubTab('dppana')}
                              >
                                DP PANA &amp; TRIO(<b>250 &amp; 700</b>)
                              </button>
                            </li>
                          </ul>

                          <div className="tab-content pana-tab-content">
                            {/* SP PANA SUB-TAB */}
                            {activePanaSubTab === 'sppana' && (
                              <div className="tab-pane active" id="sppana">
                                <div className="worli-box-row pana-columns-row">
                                  {DIGIT_KEYS.map((digit) => (
                                    <div key={digit} className="worli-odd-box-col">
                                      <span className="worli-odd back header-digit">{digit}</span>
                                      <div className="worli-sub-odd-box-container">
                                        {(SP_PANA_DATA[digit] || []).map((pNum) => (
                                          <div
                                            key={pNum}
                                            className="worli-sub-odd-box back"
                                            onClick={() => handleBet(`SP Pana ${pNum}`, 140)}
                                          >
                                            <span className="worli-odd">{pNum}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* DP PANA & TRIO SUB-TAB */}
                            {activePanaSubTab === 'dppana' && (
                              <div className="tab-pane active" id="dppana">
                                <h4>DP PANA</h4>
                                <div className="worli-box-row pana-columns-row">
                                  {DIGIT_KEYS.map((digit) => (
                                    <div key={digit} className="worli-odd-box-col">
                                      <span className="worli-odd back header-digit">{digit}</span>
                                      <div className="worli-sub-odd-box-container">
                                        {(DP_PANA_DATA[digit] || []).map((pNum) => (
                                          <div
                                            key={pNum}
                                            className="worli-sub-odd-box back"
                                            onClick={() => handleBet(`DP Pana ${pNum}`, 250)}
                                          >
                                            <span className="worli-odd">{pNum}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <h4 className="mt-3">TP PANA</h4>
                                <div className="worli-box-row tp-pana-row">
                                  {TP_PANA_LIST.map((tpNum) => (
                                    <div
                                      key={tpNum}
                                      className="worli-odd-box back"
                                      onClick={() => handleBet(`TP Pana ${tpNum}`, 700)}
                                    >
                                      <span className="worli-odd">{tpNum}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 4. ── SP Tab Pane ── */}
                    <div
                      role="tabpanel"
                      id="worli-tabs-tabpane-sp"
                      aria-labelledby="worli-tabs-tab-sp"
                      className={`fade sp tab-pane${activeWorliTab === 'sp' ? ' active show' : ''}`}
                    >
                      <div className="worlibox">
                        <div className="worli-box-title"><b>140</b></div>
                        <div className="worli-left">
                          <div className="worli-box-row">
                            {['1', '2', '3', '4', '5'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`SP-${n}`, 140)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                          <div className="worli-box-row">
                            {['6', '7', '8', '9', '0'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`SP-${n}`, 140)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="worli-right">
                          <div className="worli-box-row">
                            <div
                              className="worli-odd-box back"
                              onClick={() => handleBet('SP ALL', 140)}
                            >
                              <span className="worli-odd">SP ALL</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 5. ── DP Tab Pane ── */}
                    <div
                      role="tabpanel"
                      id="worli-tabs-tabpane-dp"
                      aria-labelledby="worli-tabs-tab-dp"
                      className={`fade dp tab-pane${activeWorliTab === 'dp' ? ' active show' : ''}`}
                    >
                      <div className="worlibox">
                        <div className="worli-box-title"><b>250</b></div>
                        <div className="worli-left">
                          <div className="worli-box-row">
                            {['1', '2', '3', '4', '5'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`DP-${n}`, 250)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                          <div className="worli-box-row">
                            {['6', '7', '8', '9', '0'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`DP-${n}`, 250)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="worli-right">
                          <div className="worli-box-row">
                            <div
                              className="worli-odd-box back"
                              onClick={() => handleBet('DP ALL', 250)}
                            >
                              <span className="worli-odd">DP ALL</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 6. ── TRIO Tab Pane ── */}
                    <div
                      role="tabpanel"
                      id="worli-tabs-tabpane-trio"
                      aria-labelledby="worli-tabs-tab-trio"
                      className={`fade trio tab-pane${activeWorliTab === 'trio' ? ' active show' : ''}`}
                    >
                      <div className="worlibox">
                        <div className="worli-full">
                          <div className="worli-box-title"><b>700</b></div>
                          <div className="worli-box-row">
                            <div
                              className="worli-odd-box back full-row-box"
                              onClick={() => handleBet('ALL TRIO', 700)}
                            >
                              <span className="worli-odd">ALL TRIO</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 7. ── CYCLE Tab Pane ── */}
                    <div
                      role="tabpanel"
                      id="worli-tabs-tabpane-cycle"
                      aria-labelledby="worli-tabs-tab-cycle"
                      className={`fade cycle tab-pane${activeWorliTab === 'cycle' ? ' active show' : ''}`}
                    >
                      <div className="worlibox">
                        <div className="worli-full">
                          <div className="worli-box-title"><b>&nbsp;</b></div>
                          <div className="worli-box-row">
                            {['1', '2', '3', '4', '5'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`Cycle-${n}`, 9.5)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                          <div className="worli-box-row">
                            {['6', '7', '8', '9', '0'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`Cycle-${n}`, 9.5)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 8. ── MOTOR SP Tab Pane ── */}
                    <div
                      role="tabpanel"
                      id="worli-tabs-tabpane-motor"
                      aria-labelledby="worli-tabs-tab-motor"
                      className={`fade motorsp tab-pane${activeWorliTab === 'motor' ? ' active show' : ''}`}
                    >
                      <div className="worlibox">
                        <div className="worli-full">
                          <div className="worli-box-title"><b>&nbsp;</b></div>
                          <div className="worli-box-row">
                            {['1', '2', '3', '4', '5'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`Motor-${n}`, 140)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                          <div className="worli-box-row">
                            {['6', '7', '8', '9', '0'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`Motor-${n}`, 140)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 9. ── 56 CHARTS Tab Pane ── */}
                    <div
                      role="tabpanel"
                      id="worli-tabs-tabpane-chart56"
                      aria-labelledby="worli-tabs-tab-chart56"
                      className={`fade chart56 tab-pane${activeWorliTab === 'chart56' ? ' active show' : ''}`}
                    >
                      <div className="worlibox">
                        <div className="worli-box-title"><b>&nbsp;</b></div>
                        <div className="worli-left">
                          <div className="worli-box-row">
                            {['1', '2', '3', '4', '5'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`Chart56-${n}`, 56)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                          <div className="worli-box-row">
                            {['6', '7', '8', '9', '0'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`Chart56-${n}`, 56)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="worli-right">
                          <div className="worli-box-row">
                            <div
                              className="worli-odd-box back"
                              onClick={() => handleBet('56 ALL', 56)}
                            >
                              <span className="worli-odd">56 ALL</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 10. ── 64 CHARTS Tab Pane ── */}
                    <div
                      role="tabpanel"
                      id="worli-tabs-tabpane-chart64"
                      aria-labelledby="worli-tabs-tab-chart64"
                      className={`fade chart64 tab-pane${activeWorliTab === 'chart64' ? ' active show' : ''}`}
                    >
                      <div className="worlibox">
                        <div className="worli-box-title"><b>&nbsp;</b></div>
                        <div className="worli-left">
                          <div className="worli-box-row">
                            {['1', '2', '3', '4', '5'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`Chart64-${n}`, 64)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                          <div className="worli-box-row">
                            {['6', '7', '8', '9', '0'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`Chart64-${n}`, 64)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="worli-right">
                          <div className="worli-box-row">
                            <div
                              className="worli-odd-box back"
                              onClick={() => handleBet('64 ALL', 64)}
                            >
                              <span className="worli-odd">64 ALL</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 11. ── ABR Tab Pane ── */}
                    <div
                      role="tabpanel"
                      id="worli-tabs-tabpane-abr"
                      aria-labelledby="worli-tabs-tab-abr"
                      className={`fade abr tab-pane${activeWorliTab === 'abr' ? ' active show' : ''}`}
                    >
                      <div className="worlibox">
                        <div className="worli-box-title"><b>&nbsp;</b></div>
                        <div className="worli-left">
                          <div className="worli-box-row">
                            {['A', 'B', 'R'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`ABR-${n}`, 9.5)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                          <div className="worli-box-row">
                            {['AB', 'AR', 'BR'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`ABR-${n}`, 90)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="worli-right">
                          <div className="worli-box-row">
                            <div
                              className="worli-odd-box back"
                              onClick={() => handleBet('ABR', 700)}
                            >
                              <span className="worli-odd">ABR</span>
                            </div>
                          </div>
                          <div className="worli-box-row">
                            <div
                              className="worli-odd-box back"
                              onClick={() => handleBet('ABR CUT', 700)}
                            >
                              <span className="worli-odd">ABR CUT</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 12. ── COMMON SP Tab Pane ── */}
                    <div
                      role="tabpanel"
                      id="worli-tabs-tabpane-commonsp"
                      aria-labelledby="worli-tabs-tab-commonsp"
                      className={`fade commonsp tab-pane${activeWorliTab === 'commonsp' ? ' active show' : ''}`}
                    >
                      <div className="worlibox">
                        <div className="worli-full">
                          <div className="worli-box-title"><b>&nbsp;</b></div>
                          <div className="worli-box-row">
                            {['1', '2', '3', '4', '5'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`CommonSP-${n}`, 140)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                          <div className="worli-box-row">
                            {['6', '7', '8', '9', '0'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`CommonSP-${n}`, 140)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 13. ── COMMON DP Tab Pane ── */}
                    <div
                      role="tabpanel"
                      id="worli-tabs-tabpane-commondp"
                      aria-labelledby="worli-tabs-tab-commondp"
                      className={`fade commondp tab-pane${activeWorliTab === 'commondp' ? ' active show' : ''}`}
                    >
                      <div className="worlibox">
                        <div className="worli-full">
                          <div className="worli-box-title"><b>&nbsp;</b></div>
                          <div className="worli-box-row">
                            {['1', '2', '3', '4', '5'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`CommonDP-${n}`, 250)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                          <div className="worli-box-row">
                            {['6', '7', '8', '9', '0'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`CommonDP-${n}`, 250)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 14. ── COLOR DP Tab Pane ── */}
                    <div
                      role="tabpanel"
                      id="worli-tabs-tabpane-colordp"
                      aria-labelledby="worli-tabs-tab-colordp"
                      className={`fade colordp tab-pane${activeWorliTab === 'colordp' ? ' active show' : ''}`}
                    >
                      <div className="worlibox">
                        <div className="worli-box-title"><b>&nbsp;</b></div>
                        <div className="worli-left">
                          <div className="worli-box-row">
                            {['1', '2', '3', '4', '5'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`ColorDP-${n}`, 250)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                          <div className="worli-box-row">
                            {['6', '7', '8', '9', '0'].map((n) => (
                              <div
                                key={n}
                                className="worli-odd-box back"
                                onClick={() => handleBet(`ColorDP-${n}`, 250)}
                              >
                                <span className="worli-odd">{n}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="worli-right">
                          <div className="worli-box-row">
                            <div
                              className="worli-odd-box back"
                              onClick={() => handleBet('COLOR DP ALL', 250)}
                            >
                              <span className="worli-odd">COLOR DP ALL</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

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
