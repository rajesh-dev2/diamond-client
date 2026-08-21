/**
 * CasinoLayout
 * ────────────
 * Reusable layout shell for all casino game detail pages.
 *
 * Encapsulates:
 *   • Standard page grid (`gdv2-page`, `gdv2-layout`, `gdv2-main`)
 *   • Shared header bar (`MarketTitle` with Rules & Round ID)
 *   • Casino mobile tab navigation ("Game" & "Placed Bet")
 *   • Desktop right sidebar (`gdv2-right-sidebar` with `PlaceBetSidebar` & `MyBetsSidebar`)
 *   • Mobile place bet dialog (`PlaceBetModal`)
 *   • Complete bet placement state management and handlers
 *
 * Props
 * ─────
 * @prop {string}          title        – Game title (e.g. "Goal 2")
 * @prop {string|number}   roundId      – Current round identifier
 * @prop {string}          rulesLink    – Link URL for Rules (default: "/casino-results")
 * @prop {function}        onRulesClick – Optional custom Rules click handler
 * @prop {function}        onPlaceBet   – Optional custom async bet handler
 * @prop {Array}           initialBets  – Optional initial bets
 * @prop {string}          mainClass    – Extra className for gdv2-main
 * @prop {ReactNode|func}  children     – Content to render inside gdv2-main or render function
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { message } from 'antd'
import MarketTitle from '../game-details/MarketTitle'
import MobileTabs from '../game-details/MobileTabs'
import PlaceBetSidebar from '../game-details/Sidebar/PlaceBetSidebar'
import MyBetsSidebar from '../game-details/Sidebar/MyBetsSidebar'
import PlaceBetModal from '../PlaceBetModal'
import './style.css'

export default function CasinoLayout({
  title,
  roundId,
  rulesLink = '/casino-results',
  onRulesClick,
  onPlaceBet,
  initialBets = [],
  mainClass = '',
  children,
}) {
  const [mobileTab, setMobileTab]       = useState('game')
  const [betModalData, setBetModalData] = useState(null)
  const [showBetModal, setShowBetModal] = useState(false)
  const [sidebarOdds, setSidebarOdds]   = useState('')
  const [sidebarAmount, setSidebarAmount] = useState('')
  const [isPlacingBet, setIsPlacingBet] = useState(false)
  const [myBets, setMyBets]             = useState(initialBets)
  const sidebarRef                      = useRef(null)

  // Sync odds when a new selection is tapped
  useEffect(() => {
    if (betModalData) {
      setSidebarOdds(betModalData.odds || '1.00')
      setSidebarAmount('')
    }
  }, [betModalData])

  // Click handler passed down to odds boxes / CasinoMarket
  const handleOddClick = useCallback((runner, type) => {
    const oddsVal = String(type === 'back' ? runner.back : runner.lay)
    if (!oddsVal || oddsVal === '-') return
    setBetModalData({ runnerName: runner.name, odds: oddsVal, type })
    if (window.innerWidth < 1200) {
      setShowBetModal(true)
    } else {
      sidebarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  const handleSidebarOddsChange = useCallback((delta) => {
    setSidebarOdds((prev) => Math.max(1.01, (parseFloat(prev) || 0) + delta).toFixed(2))
  }, [])

  const handleSidebarAddStake = useCallback((val) => {
    setSidebarAmount((prev) => ((parseFloat(prev) || 0) + val).toString())
  }, [])

  const handleClear = useCallback(() => setSidebarAmount(''), [])

  const handleReset = useCallback(() => {
    setBetModalData(null)
    setShowBetModal(false)
  }, [])

  const sidebarNumericOdds   = parseFloat(sidebarOdds)   || 0
  const sidebarNumericAmount = parseFloat(sidebarAmount) || 0
  const sidebarProfit = sidebarNumericAmount > 0
    ? (sidebarNumericAmount * (sidebarNumericOdds > 1 ? sidebarNumericOdds - 1 : 1)).toFixed(2)
    : '0'

  const handleSidebarSubmit = async () => {
    if (!betModalData || !sidebarAmount || parseFloat(sidebarAmount) <= 0 || isPlacingBet) return

    setIsPlacingBet(true)
    try {
      if (onPlaceBet) {
        await onPlaceBet({
          runnerName: betModalData.runnerName,
          type: betModalData.type,
          odds: sidebarOdds,
          amount: sidebarAmount,
        })
      } else {
        // Default simulated bet placement
        await new Promise((r) => setTimeout(r, 600))
        setMyBets((prev) => [
          ...prev,
          {
            mid: title?.toLowerCase() || 'casino',
            sid: Date.now(),
            createdAt: Date.now(),
            nat: betModalData.runnerName,
            otype: betModalData.type,
            odds: sidebarOdds,
            stake: sidebarAmount,
          },
        ])
        message.success(`Bet placed on ${betModalData.runnerName} @ ${sidebarOdds}`)
      }
      setBetModalData(null)
      setShowBetModal(false)
    } catch (err) {
      message.error(err?.message || 'Failed to place bet')
    } finally {
      setIsPlacingBet(false)
    }
  }

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1200

  // Render child content (supporting both function child or standard elements)
  const renderedContent = typeof children === 'function'
    ? children({
        onOddClick: handleOddClick,
        betModalData,
        myBets,
        isDesktop,
        activeMobileTab: mobileTab,
      })
    : children

  const casinoTabs = [
    { key: 'game', label: 'Game' },
    { key: 'bets', label: `Placed Bet (${myBets.length})` },
  ]

  return (
    <div className="gdv2-page casino-page">
      <div className="gdv2-layout">

        {/* ── Left: main content ── */}
        <div className={`gdv2-main ${mainClass}`.trim()}>

          {/* Header Bar */}
          {title && (
            <MarketTitle
              title={title}
              rulesLink={rulesLink}
              onRulesClick={onRulesClick}
              roundId={roundId}
            />
          )}

          {/* Mobile Tabs — using shared gdv2-mobile-tabs */}
          <MobileTabs
            activeTab={mobileTab}
            onTabChange={setMobileTab}
            betCount={myBets.length}
            tabs={casinoTabs}
          />

          {/* Game View */}
          {(mobileTab === 'game' || isDesktop) && renderedContent}

          {/* Mobile Placed Bets View */}
          {mobileTab === 'bets' && !isDesktop && (
            <div className="csn-mobile-bets-wrap">
              <MyBetsSidebar bets={myBets} />
            </div>
          )}
        </div>

        {/* ── Right: desktop sidebar ── */}
        <div className="gdv2-right-sidebar" ref={sidebarRef}>
          <div className="gdv2-sidebar">
            <PlaceBetSidebar
              betData={betModalData}
              odds={sidebarOdds}
              amount={sidebarAmount}
              profit={sidebarProfit}
              isPlacing={isPlacingBet}
              onOddsChange={handleSidebarOddsChange}
              onAmountChange={setSidebarAmount}
              onAddStake={handleSidebarAddStake}
              onClear={handleClear}
              onReset={handleReset}
              onSubmit={handleSidebarSubmit}
            />
            <MyBetsSidebar bets={myBets} />
          </div>
        </div>
      </div>

      {/* ── Mobile Place Bet Modal ── */}
      <PlaceBetModal
        show={showBetModal}
        onHide={() => setShowBetModal(false)}
        betData={betModalData}
        odds={sidebarOdds}
        amount={sidebarAmount}
        profit={sidebarProfit}
        isPlacing={isPlacingBet}
        onOddsChange={handleSidebarOddsChange}
        onAmountChange={setSidebarAmount}
        onAddStake={handleSidebarAddStake}
        onClear={handleClear}
        onReset={handleReset}
        onSubmit={handleSidebarSubmit}
      />
    </div>
  )
}
