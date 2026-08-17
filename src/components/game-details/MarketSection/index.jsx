import './style.css'
import LadderMarket from '../LadderMarket'
import FancyMarket from '../FancyMarket'
import OddEvenMarket from '../OddEvenMarket'
import NumberMarket from '../NumberMarket'

function getFancySubType(market) {
  const mname = (market.mname || '').toLowerCase()
  if (mname.includes('oddeven') || mname === 'oddeven') return 'oddeven'
  const names = (market.section || []).map((s) => (s.nat || '').trim())
  const hasNumbered = names.some((n) => /^\d+\s*number$/i.test(n))
  if (hasNumbered) return 'number'
  return 'fancy'
}

export default function MarketSection({ matchOddsMarket, bookmakerMarkets, otherMarkets, onOddClick, fancyPl }) {
  // ── Bookmaker layout ─────────────────────────────────────────────
  const bm2 = bookmakerMarkets.find((m) => (m.mname || '').toLowerCase().includes('bookmaker 2'))

  let bookmakerContent = null
  if (bookmakerMarkets.length > 0) {
    if (!bm2) {
      bookmakerContent = bookmakerMarkets.map((m) => (
        <LadderMarket key={m.marketId} market={m} onOddClick={onOddClick} bookType="bookmaker" />
      ))
    } else {
      const bm1 = bookmakerMarkets.find((m) => m !== bm2) || bookmakerMarkets[0]
      const rest = bookmakerMarkets.filter((m) => m !== bm1 && m !== bm2)
      bookmakerContent = (
        <>
          <div className="gdv2-bm-pair">
            {bm1 && (
              <div className="gdv2-bm-main">
                <LadderMarket market={bm1} onOddClick={onOddClick} bookType="bookmaker" />
              </div>
            )}
            <div className="gdv2-bm-compact">
              <LadderMarket market={bm2} onOddClick={onOddClick} bookType="bookmaker" compact />
            </div>
          </div>
          {rest.map((m) => (
            <LadderMarket key={m.marketId} market={m} onOddClick={onOddClick} bookType="bookmaker" />
          ))}
        </>
      )
    }
  }

  // ── Group other markets ──────────────────────────────────────────
  const numberMarkets  = []
  const fancyMarkets   = []
  const oddEvenMarkets = []

  otherMarkets.forEach((m) => {
    const sub = getFancySubType(m)
    if      (sub === 'number')  numberMarkets.push(m)
    else if (sub === 'oddeven') oddEvenMarkets.push(m)
    else                         fancyMarkets.push(m)
  })

  return (
    <>
      {matchOddsMarket && (
        <LadderMarket market={matchOddsMarket} onOddClick={onOddClick} bookType="match" />
      )}
      {bookmakerContent}
      {fancyMarkets.map((m) => (
        <FancyMarket key={m.marketId} market={m} onOddClick={onOddClick} pl={fancyPl} />
      ))}
      {oddEvenMarkets.map((m) => (
        <OddEvenMarket key={m.marketId} market={m} onOddClick={onOddClick} pl={fancyPl} />
      ))}
      {numberMarkets.length > 0 && (
        <div className="gdv2-number-pair-grid">
          {numberMarkets.map((m) => (
            <NumberMarket key={m.marketId} market={m} onOddClick={onOddClick} pl={fancyPl} />
          ))}
        </div>
      )}
    </>
  )
}
