/**
 * GameDetails — clean, modular page shell.
 * Integrated with real-time Socket.IO odds, RTK Query endpoints,
 * event metadata, matched bets, and bet placement mutations.
 */
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { message } from 'antd'

// ── Components (from shared modular components) ───────────────────
import GameHeader    from '../../components/game-details/GameHeader'
import MobileTabs   from '../../components/game-details/MobileTabs'
import Scorecard    from '../../components/game-details/Scorecard'
import MarketSection from '../../components/game-details/MarketSection'
import RightSidebar  from '../../components/game-details/Sidebar/RightSidebar'
import PlaceBetModal from '../../components/PlaceBetModal'

// ── Utilities ──────────────────────────────────────────────────────
import {
  isLadderMarket,
  oddsByName,
  findSectionByFancyId,
  plByFancyId,
} from '../../components/game-details/utils'

// ── Store & APIs ───────────────────────────────────────────────────
import {
  useGetEventsQuery,
  usePlaceBetMutation,
  useGetBetsQuery,
  useGetFancyPlQuery,
} from '../../store/api/authApi'
import useMatchOddsSocket from '../../hooks/useMatchOddsSocket'

// ── Page CSS ───────────────────────────────────────────────────────
import './style.css'

export default function GameDetails() {
  const { sportId, eventId } = useParams()

  // ── Mobile tab state ──────────────────────────────────────────
  const [activeMobileTab, setActiveMobileTab] = useState('odds')

  // ── Bet modal state ───────────────────────────────────────────
  const [showBetModal, setShowBetModal] = useState(false)
  const [betModalData, setBetModalData] = useState(null)
  const sidebarRef = useRef(null)

  // ── Live Socket.IO Odds Stream ────────────────────────────────
  const { marketData, isConnected } = useMatchOddsSocket({
    gmid: Number(eventId),
    etid: Number(sportId) || 1,
    enabled: Boolean(eventId),
  })

  // ── Event Metadata Query ──────────────────────────────────────
  const { data: events } = useGetEventsQuery(Number(sportId), { skip: !sportId })
  const eventInfo = events?.find((e) => String(e.gmid) === String(eventId))

  const title = eventInfo?.ename || 'Match Details'
  const date  = eventInfo?.stime  || ''

  // Live markets from Socket.IO stream
  const activeMarkets = marketData || []

  // ── User Matched Bets ─────────────────────────────────────────
  const { data: myBets } = useGetBetsQuery()
  const bets = (myBets || []).filter((bet) => String(bet.gmid) === String(eventId))

  // ── Fancy P&L Book ───────────────────────────────────────────
  const { data: fancyPl } = useGetFancyPlQuery(Number(eventId), { skip: !eventId })
  const fancyPlByFancyId  = plByFancyId(fancyPl)

  // ── Market Categorisation ─────────────────────────────────────
  const matchOddsMarket = activeMarkets.find((m) => m.gtype === 'match')
  const bookmakerMarkets = activeMarkets
    .filter((m) => m !== matchOddsMarket && isLadderMarket(m))
    .sort((a, b) => a.sno - b.sno)
  const otherMarkets = activeMarkets
    .filter((m) => m !== matchOddsMarket && !isLadderMarket(m))
    .sort((a, b) => a.sno - b.sno)

  // ── Bet Placement Mutation ────────────────────────────────────
  const [placeBet, { isLoading: isPlacingBet }] = usePlaceBetMutation()

  const [sidebarOdds,   setSidebarOdds]   = useState('')
  const [sidebarAmount, setSidebarAmount] = useState('')

  useEffect(() => {
    if (betModalData) {
      setSidebarOdds(betModalData.odds || '1.00')
      setSidebarAmount('')
    }
  }, [betModalData])

  const handleOddBoxClick = (runnerName, oddsVal, type, runnersList = [], betMeta = null) => {
    if (!oddsVal || oddsVal === '-') return
    setBetModalData({ runnerName, odds: oddsVal, type: type || 'back', runnersList, betMeta })
    if (window.innerWidth < 1200) {
      setShowBetModal(true)
    } else {
      sidebarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleSidebarOddsChange = (delta) =>
    setSidebarOdds(Math.max(1.01, (parseFloat(sidebarOdds) || 0) + delta).toFixed(2))

  const handleSidebarAddStake = (val) =>
    setSidebarAmount(((parseFloat(sidebarAmount) || 0) + val).toString())

  const sidebarNumericOdds   = parseFloat(sidebarOdds)   || 0
  const sidebarNumericAmount = parseFloat(sidebarAmount) || 0
  const sidebarProfit = sidebarNumericAmount > 0
    ? (sidebarNumericAmount * (sidebarNumericOdds > 1 ? sidebarNumericOdds - 1 : 1)).toFixed(2)
    : '0'

  const handlePlaceBet = async (newBet) => {
    if (!newBet.amount) return
    const stake      = Number(newBet.amount)
    const otype      = betModalData?.type || 'back'
    const runnerName = betModalData?.runnerName

    try {
      if (betModalData?.betMeta?.fancyId) {
        const { fancyId } = betModalData.betMeta
        const section = findSectionByFancyId(activeMarkets, fancyId)
        const liveOdds = section && oddsByName(section)[otype === 'lay' ? 'lay1' : 'back1']
        if (!liveOdds?.odds) {
          message.error('Odds changed, please try again')
          return
        }
        await placeBet({ fancyId, otype, stake, odds: liveOdds.odds, size: liveOdds.size }).unwrap()
      } else if (betModalData?.betMeta?.marketId) {
        await placeBet({ marketId: betModalData.betMeta.marketId, sid: betModalData.betMeta.sid, otype, stake }).unwrap()
      }
    } catch (err) {
      message.error(err?.data?.message || 'Failed to place bet')
      return
    }

    message.success(`Bet placed on ${runnerName} @ ${newBet.odds}`)
    setBetModalData(null)
    setShowBetModal(false)
  }

  const handleSidebarSubmit = () => {
    if (!betModalData || !sidebarAmount || parseFloat(sidebarAmount) <= 0 || isPlacingBet) return
    handlePlaceBet({ runner: betModalData.runnerName, odds: sidebarOdds, amount: sidebarAmount })
  }

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1200

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="gdv2-page">
      <div className="gdv2-layout">

        {/* Main Content Area */}
        <div className="gdv2-main">
          <GameHeader title={title} date={date} />
          <MobileTabs
            activeTab={activeMobileTab}
            onTabChange={setActiveMobileTab}
            betCount={bets.length}
          />
          <Scorecard />

          {(activeMobileTab === 'odds' || isDesktop) && (
            activeMarkets.length === 0 ? (
              <div style={{ padding: '24px 16px', background: '#fff', color: '#666', textAlign: 'center', fontWeight: 600 }}>
                {isConnected ? 'Loading markets...' : 'Connecting to live odds…'}
              </div>
            ) : (
              <MarketSection
                matchOddsMarket={matchOddsMarket}
                bookmakerMarkets={bookmakerMarkets}
                otherMarkets={otherMarkets}
                onOddClick={handleOddBoxClick}
                fancyPl={fancyPlByFancyId}
              />
            )
          )}
        </div>

        {/* Desktop Sidebar (Place Bet slip + My Bets) */}
        <div ref={sidebarRef}>
          <RightSidebar
            betData={betModalData}
            odds={sidebarOdds}
            amount={sidebarAmount}
            profit={sidebarProfit}
            isPlacing={isPlacingBet}
            onOddsChange={handleSidebarOddsChange}
            onAmountChange={setSidebarAmount}
            onAddStake={handleSidebarAddStake}
            onClear={() => setSidebarAmount('')}
            onReset={() => { setBetModalData(null); setShowBetModal(false) }}
            onSubmit={handleSidebarSubmit}
            bets={bets}
          />
        </div>
      </div>

      {/* Mobile Place Bet Modal */}
      <PlaceBetModal
        show={showBetModal}
        onHide={() => setShowBetModal(false)}
        betData={betModalData}
        onPlaceBet={handlePlaceBet}
      />
    </div>
  )
}
