import { useState, useEffect, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { Toast, ToastContainer } from 'react-bootstrap'
import PlaceBetModal from '../../components/PlaceBetModal'
import useMatchOddsSocket from '../../hooks/useMatchOddsSocket'
import {
  useGetEventsQuery,
  usePlaceBetMutation,
  useGetBetsQuery,
  useGetMatchOddsBookQuery,
  useGetBookmakerBookQuery,
  useGetFancyPlQuery,
} from '../../store/api/authApi'
import './style.css'

// MATCH_ODDS / Bookmaker markets carry a 3-tier back/lay ladder per runner.
// Feed names the tiers back3..back1 (worst to best) and lay1..lay3 (best to worst);
// the UI's column classes use the opposite naming for the best-price column (no suffix).
const LADDER_COLUMNS = [
  { key: 'back3', cssClass: 'back2', side: 'back' },
  { key: 'back2', cssClass: 'back1', side: 'back' },
  { key: 'back1', cssClass: 'back', side: 'back' },
  { key: 'lay1', cssClass: 'lay', side: 'lay' },
  { key: 'lay2', cssClass: 'lay1', side: 'lay' },
  { key: 'lay3', cssClass: 'lay2', side: 'lay' }
]

function oddsByName(section) {
  const map = {}
  ;(section.odds || []).forEach((o) => { map[o.oname] = o })
  return map
}

// Suspended/active state lives on section.gstatus, not the market's top-level status.
// Fancy markets leave gstatus blank while tradable and only set it to "SUSPENDED"
// (or similar) when a section actually stops taking bets — blank is NOT suspended.
function isSuspended(section) {
  const status = (section.gstatus || '').toUpperCase()
  return status !== '' && status !== 'ACTIVE'
}

function formatOdd(entry) {
  return entry && entry.odds ? String(entry.odds) : '-'
}

function formatVol(entry) {
  return entry && entry.size ? String(entry.size) : ''
}

// Bookmaker/MATCH_ODDS/Tied Match render as a back/lay ladder keyed by marketId+sid.
// Everything else (Normal, khado, oddeven, meter, fancy1, Ball By Ball, Over By Over,
// 0-9 Number, Score More Runs, football exchange group, ...) is a single-select
// market keyed by fancyId — even when the feed happens to tag it gtype "match1"
// (e.g. "Score More Runs"), so gtype alone can't tell the two apart.
function isLadderMarket(market) {
  if (market.gtype === 'match') return true
  const name = (market.mname || '').toLowerCase()
  return name.startsWith('bookmaker') || name.includes('tied match')
}

function findSectionByFancyId(markets, fancyId) {
  for (const market of markets) {
    const section = market.section?.find((s) => s.fancyId === fancyId)
    if (section) return section
  }
  return null
}

function bookBySid(book) {
  const map = {}
  ;(book || []).forEach((b) => { map[String(b.sid)] = b })
  return map
}

function plByFancyId(pl) {
  const map = {}
  ;(pl || []).forEach((p) => { map[p.fancyId] = p })
  return map
}

function LadderMarket({ market, onOddClick, bookType }) {
  const marketId = market?.marketId
  const { data: matchBook } = useGetMatchOddsBookQuery(marketId, { skip: !marketId || bookType !== 'match' })
  const { data: bookmakerBook } = useGetBookmakerBookQuery(marketId, { skip: !marketId || bookType !== 'bookmaker' })

  if (!market) return null
  const runnerNames = market.section.map((s) => s.nat)
  const maxLabel = market.min ? `Min: ${market.min} Max: ${market.max}` : `Max: ${market.max}`
  const book = bookBySid(bookType === 'match' ? matchBook : bookmakerBook)

  return (
    <div className="game-market market-4">
      <div className="market-title">
        <span>{market.mname}</span>
        <button className="btn btn-success btn-sm" disabled>Cashout</button>
      </div>
      <div className="market-header">
        <div className="market-nation-detail">
          <span className="market-nation-name">{maxLabel}</span>
        </div>
        <div className="market-odd-box no-border d-none d-md-block"></div>
        <div className="market-odd-box no-border d-none d-md-block"></div>
        <div className="market-odd-box back"><b>Back</b></div>
        <div className="market-odd-box lay"><b>Lay</b></div>
        <div className="market-odd-box"></div>
        <div className="market-odd-box no-border"></div>
      </div>

      <div className="market-body" data-title={market.status}>
        {market.section.map((section) => {
          const odds = oddsByName(section)
          const suspended = isSuspended(section)
          const runnerBook = book[String(section.sid)]
          return (
            <div className={`market-row ${suspended ? 'suspended-row' : ''}`} data-title={suspended ? 'SUSPENDED' : 'ACTIVE'} key={section.sid}>
              <div className="market-nation-detail">
                <span className="market-nation-name">{section.nat}</span>
                {runnerBook && (
                  <div className={`market-nation-book ${runnerBook.profit < 0 ? 'negative' : ''}`}>
                    {runnerBook.profit > 0 ? `+${runnerBook.profit}` : runnerBook.profit}
                  </div>
                )}
              </div>
              {LADDER_COLUMNS.map(({ key, cssClass, side }) => (
                <div
                  key={key}
                  className={`market-odd-box ${cssClass}`}
                  onClick={() => !suspended && onOddClick(
                    section.nat,
                    formatOdd(odds[key]),
                    side,
                    runnerNames,
                    { marketId: market.marketId, sid: String(section.sid) }
                  )}
                >
                  <span className="market-odd">{formatOdd(odds[key])}</span>
                  <span className="market-volume">{formatVol(odds[key])}</span>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {market.rem && (
        <div className="market-row">
          <p className="market-remark">{market.rem}</p>
        </div>
      )}
    </div>
  )
}

function FancyMarket({ market, onOddClick, pl }) {
  const sections = market.section.slice().sort((a, b) => a.sno - b.sno)
  const hasLay = sections.some((s) => oddsByName(s).lay1)

  return (
    <div className="game-market market-6">
      <div className="market-title"><span>{market.mname}</span></div>

      <div className="row row10">
        {[0, 1].map((i) => (
          <div className={`col-md-6 ${i === 1 ? 'd-none d-xl-block' : ''}`} key={i}>
            <div className="market-header">
              <div className="market-nation-detail"></div>
              {hasLay && <div className="market-odd-box lay"><b>No</b></div>}
              <div className="market-odd-box back"><b>{hasLay ? 'Yes' : 'Back'}</b></div>
              <div className="fancy-min-max-box"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="market-body" data-title={market.status}>
        <div className="row row10">
          {sections.map((section) => {
            const odds = oddsByName(section)
            const suspended = isSuspended(section)
            const runnerPl = pl?.[section.fancyId]
            return (
              <Fragment key={section.sid}>
                <div className="col-md-6">
                  <div className={`fancy-market ${suspended ? 'suspended-row' : ''}`} data-title={suspended ? 'SUSPENDED' : ''}>
                    <div className="market-row">
                      <div className="market-nation-detail">
                        <span className="market-nation-name">{section.nat}</span>
                        {runnerPl?.pl !== 0 && runnerPl?.pl != null && (
                          <div className={`market-nation-book ${runnerPl.pl < 0 ? 'negative' : ''}`}>
                            {runnerPl.pl > 0 ? `+${runnerPl.pl}` : runnerPl.pl}
                          </div>
                        )}
                      </div>
                      {hasLay && (
                        <div className="market-odd-box lay" onClick={() => !suspended && onOddClick(section.nat, formatOdd(odds.lay1), 'lay', [section.nat], { fancyId: section.fancyId })}>
                          <span className="market-odd">{formatOdd(odds.lay1)}</span>
                          <span className="market-volume">{formatVol(odds.lay1)}</span>
                        </div>
                      )}
                      <div className="market-odd-box back" onClick={() => !suspended && onOddClick(section.nat, formatOdd(odds.back1), 'back', [section.nat], { fancyId: section.fancyId })}>
                        <span className="market-odd">{formatOdd(odds.back1)}</span>
                        <span className="market-volume">{formatVol(odds.back1)}</span>
                      </div>
                      <div className="fancy-min-max-box">
                        <div className="fancy-min-max">
                          <span className="w-100 d-block">Min: {section.min}</span>
                          <span className="w-100 d-block">Max: {section.max}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {section.rem && (
                    <div className="market-row">
                      <p className="market-remark">{section.rem}</p>
                    </div>
                  )}
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>

      {market.rem && (
        <div className="market-row">
          <p className="market-remark">{market.rem}</p>
        </div>
      )}
    </div>
  )
}

export default function GameDetails() {
  const { sportId, eventId } = useParams()
  const [activeMobileTab, setActiveMobileTab] = useState('odds')
  const [showBetModal, setShowBetModal] = useState(false)
  const [betModalData, setBetModalData] = useState(null)
  const [betFeedback, setBetFeedback] = useState(null)

  const { marketData } = useMatchOddsSocket({
    gmid: Number(eventId),
    etid: Number(sportId) || 1,
    enabled: Boolean(eventId)
  })

  const { data: events } = useGetEventsQuery(Number(sportId), { skip: !sportId })
  const eventInfo = events?.find((e) => String(e.gmid) === String(eventId))
  const title = eventInfo?.ename || 'Loading match...'
  const date = eventInfo?.stime || ''

  const { data: myBets } = useGetBetsQuery()
  const bets = (myBets || []).filter((bet) => String(bet.gmid) === String(eventId))

  const { data: fancyPl } = useGetFancyPlQuery(Number(eventId), { skip: !eventId })
  const fancyPlByFancyId = plByFancyId(fancyPl)

  const matchOddsMarket = marketData.find((m) => m.gtype === 'match')
  const bookmakerMarkets = marketData
    .filter((m) => m !== matchOddsMarket && isLadderMarket(m))
    .sort((a, b) => a.sno - b.sno)
  const otherMarkets = marketData
    .filter((m) => m !== matchOddsMarket && !isLadderMarket(m))
    .sort((a, b) => a.sno - b.sno)

  const [placeBet, { isLoading: isPlacingBet }] = usePlaceBetMutation()

  const [sidebarOdds, setSidebarOdds] = useState('')
  const [sidebarAmount, setSidebarAmount] = useState('')

  useEffect(() => {
    if (betModalData) {
      setSidebarOdds(betModalData.odds || '1.00')
      setSidebarAmount('')
    }
  }, [betModalData])

  const handleOddBoxClick = (runnerName, oddsVal, type, runnersList = [], betMeta = null) => {
    if (!oddsVal || oddsVal === '-') return
    setBetModalData({
      runnerName,
      odds: oddsVal,
      type: type || 'back',
      runnersList,
      betMeta
    })
    // Desktop keeps the always-visible sidebar bet slip in sync; the modal is for mobile,
    // where that sidebar is hidden (`d-none d-xl-block`).
    if (window.innerWidth < 1200) {
      setShowBetModal(true)
    }
  }

  const handleSidebarOddsChange = (delta) => {
    const numericOdds = parseFloat(sidebarOdds) || 0
    setSidebarOdds(Math.max(1.01, numericOdds + delta).toFixed(2))
  }

  const handleSidebarAddStake = (val) => {
    const currentAmount = parseFloat(sidebarAmount) || 0
    setSidebarAmount((currentAmount + val).toString())
  }

  const handleSidebarClear = () => setSidebarAmount('')

  const handleSidebarReset = () => {
    setBetModalData(null)
    setShowBetModal(false)
  }

  const sidebarNumericOdds = parseFloat(sidebarOdds) || 0
  const sidebarNumericAmount = parseFloat(sidebarAmount) || 0
  const sidebarProfit = sidebarNumericAmount > 0
    ? (sidebarNumericAmount * (sidebarNumericOdds > 1 ? sidebarNumericOdds - 1 : 1)).toFixed(2)
    : '0'

  const handleSidebarSubmit = () => {
    if (!betModalData || !sidebarAmount || parseFloat(sidebarAmount) <= 0 || isPlacingBet) return
    handlePlaceBet({ runner: betModalData.runnerName, odds: sidebarOdds, amount: sidebarAmount })
  }

  const handlePlaceBet = async (newBet) => {
    if (!newBet.amount) return
    const stake = Number(newBet.amount)
    const otype = betModalData?.type || 'back'
    const runnerName = betModalData?.runnerName

    try {
      if (betModalData?.betMeta?.fancyId) {
        const { fancyId } = betModalData.betMeta
        // Re-read the live odds/size right before submitting — the provider fresh-checks
        // these against what it's currently quoting, so a click-time snapshot can go stale.
        const section = findSectionByFancyId(marketData, fancyId)
        const liveOdds = section && oddsByName(section)[otype === 'lay' ? 'lay1' : 'back1']
        if (!liveOdds?.odds) {
          setBetFeedback({ type: 'error', message: 'Odds changed, please try again' })
          return
        }
        await placeBet({ fancyId, otype, stake, odds: liveOdds.odds, size: liveOdds.size }).unwrap()
      } else if (betModalData?.betMeta?.marketId) {
        await placeBet({ marketId: betModalData.betMeta.marketId, sid: betModalData.betMeta.sid, otype, stake }).unwrap()
      }
    } catch (err) {
      setBetFeedback({ type: 'error', message: err?.data?.message || 'Failed to place bet' })
      return
    }

    setBetFeedback({ type: 'success', message: `Bet placed on ${runnerName} @ ${newBet.odds}` })
    setBetModalData(null)
    setShowBetModal(false)
  }

  return (
    <div className="center-main-container detail-page">
      <div className="detail-layout">

        {/* Left Main Game Content Area */}
        <div className="detail-page-container center-container">
          {/* Game Header */}
          <div className="game-header">
            <span>{title}</span>
            <span className="float-right">{date}</span>
          </div>

          {/* Mobile Tabs */}
          <ul className="nav nav-tabs md:hidden! menu-tabs">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeMobileTab === 'odds' ? 'active' : ''}`}
                onClick={() => setActiveMobileTab('odds')}
              >
                Odds
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeMobileTab === 'matchedBet' ? 'active' : ''}`}
                onClick={() => setActiveMobileTab('matchedBet')}
              >
                Matched Bet ({bets.length})
              </button>
            </li>
          </ul>

          {(activeMobileTab === 'odds' || window.innerWidth >= 1200) && (
            <>
              {marketData.length === 0 ? (
                <div className="game-market market-4">
                  <div className="market-row">
                    <p className="market-remark">Connecting to live odds...</p>
                  </div>
                </div>
              ) : (
                <>
                  <LadderMarket market={matchOddsMarket} onOddClick={handleOddBoxClick} bookType="match" />
                  {bookmakerMarkets.map((market) => (
                    <LadderMarket key={market.marketId} market={market} onOddClick={handleOddBoxClick} bookType="bookmaker" />
                  ))}
                  {otherMarkets.map((market) => (
                    <FancyMarket key={market.marketId} market={market} onOddClick={handleOddBoxClick} pl={fancyPlByFancyId} />
                  ))}
                </>
              )}
            </>
          )}
        </div>

        {/* Right Sidebar - Matches SS & user HTML snippet */}
        <div className="detail-page-right d-none d-xl-block">
          <div className="sidebar right-sidebar">
            <a className="bet-nation-game-name blink-message" href="/casino/worli3">
              <i className="fas fa-info-circle me-1"></i>
              <div>Matka</div>
            </a>
            <div className="sidebar-box">
              <div className="sidebar-title">
                <h4>Live Match</h4>
              </div>
            </div>
            {betModalData && (
            <div className="sidebar-box place-bet-container">
              <div className="sidebar-title">
                <h4>Place Bet</h4>
              </div>
              <div className={`place-bet-box ${betModalData.type || 'back'}`}>
                <div className="place-bet-box-header">
                  <div className="place-bet-for">(Bet for)</div>
                  <div className="place-bet-odds">Odds</div>
                  <div className="place-bet-stake">Stake</div>
                  <div className="place-bet-profit">Profit</div>
                </div>
                <div className="place-bet-box-body">
                  <div className="place-bet-for">
                    <span>{betModalData.runnerName}</span>
                  </div>
                  <div className="place-bet-odds">
                    <div className="input-group">
                      <input type="text" className="form-control" disabled value={sidebarOdds || '-'} />
                      <div className="spinner-buttons input-group-btn btn-group-vertical">
                        <button className="btn-default" type="button" onClick={() => handleSidebarOddsChange(0.01)}><i className="fa fa-angle-up"></i></button>
                        <button className="btn-default" type="button" onClick={() => handleSidebarOddsChange(-0.01)}><i className="fa fa-angle-down"></i></button>
                      </div>
                    </div>
                  </div>
                  <div className="place-bet-stake">
                    <input
                      type="number"
                      className="form-control"
                      value={sidebarAmount}
                      onChange={(e) => setSidebarAmount(e.target.value)}
                    />
                  </div>
                  <div className="place-bet-profit">{sidebarProfit}</div>
                </div>
                <div className="place-bet-buttons">
                  <button className="btn btn-place-bet" onClick={() => handleSidebarAddStake(1000)}>+1k</button>
                  <button className="btn btn-place-bet" onClick={() => handleSidebarAddStake(2000)}>+2k</button>
                  <button className="btn btn-place-bet" onClick={() => handleSidebarAddStake(5000)}>+5k</button>
                  <button className="btn btn-place-bet" onClick={() => handleSidebarAddStake(10000)}>+10k</button>
                  <button className="btn btn-place-bet" onClick={() => handleSidebarAddStake(20000)}>+20k</button>
                  <button className="btn btn-place-bet" onClick={() => handleSidebarAddStake(25000)}>+25k</button>
                  <button className="btn btn-place-bet" onClick={() => handleSidebarAddStake(50000)}>+50k</button>
                  <button className="btn btn-place-bet" onClick={() => handleSidebarAddStake(75000)}>+75k</button>
                  <button className="btn btn-sm btn-link text-dark flex-fill text-end" onClick={handleSidebarClear}>clear</button>
                </div>
                <div className="place-bet-action-buttons">
                  <div>
                    <button className="btn btn-info">Edit</button>
                  </div>
                  <div>
                    <button className="btn btn-danger me-1" onClick={handleSidebarReset}>Reset</button>
                    <button
                      className="btn btn-success"
                      disabled={!sidebarAmount || parseFloat(sidebarAmount) <= 0 || isPlacingBet}
                      onClick={handleSidebarSubmit}
                    >
                      {isPlacingBet ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )}
            <div className="sidebar-box my-bet-container">
              <div className="sidebar-title">
                <h4>My Bet</h4>
              </div>
              <div className="my-bets">
                <div className="table-responsive w-100">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Matched Bet</th>
                        <th className="text-end">Odds</th>
                        <th className="text-end">Stake</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bets.map((bet) => (
                        <tr key={`${bet.mid}-${bet.sid}-${bet.createdAt}`} className={bet.otype === 'lay' ? 'lay' : 'back'}>
                          <td>{bet.nat} ({bet.otype})</td>
                          <td className="text-end">{bet.odds}</td>
                          <td className="text-end">{bet.stake}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <PlaceBetModal
        show={showBetModal}
        onHide={() => setShowBetModal(false)}
        betData={betModalData}
        onPlaceBet={handlePlaceBet}
      />

      <ToastContainer position="top-end" className="p-3" style={{ position: 'fixed', zIndex: 2000 }}>
        <Toast
          show={Boolean(betFeedback)}
          onClose={() => setBetFeedback(null)}
          bg={betFeedback?.type === 'success' ? 'success' : 'danger'}
          delay={3000}
          autohide
        >
          <Toast.Header closeButton>
            <strong className="me-auto">{betFeedback?.type === 'success' ? 'Bet Placed' : 'Bet Failed'}</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{betFeedback?.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  )
}
