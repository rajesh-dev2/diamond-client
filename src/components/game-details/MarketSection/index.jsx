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
  // ── Bookmaker / Tied Match paired layout ─────────────────────────
  const compactMarket = bookmakerMarkets.find((m) => {
    const name = (m.mname || '').toLowerCase()
    return name.includes('tied match') || name.includes('tied') || name.includes('bookmaker 2') || name.includes('bm 2')
  })

  let bookmakerContent = null
  if (bookmakerMarkets.length > 0) {
    if (!compactMarket || bookmakerMarkets.length === 1) {
      bookmakerContent = bookmakerMarkets.map((m) => (
        <LadderMarket key={m.marketId} market={m} onOddClick={onOddClick} bookType="bookmaker" />
      ))
    } else {
      const mainMarket = bookmakerMarkets.find((m) => m !== compactMarket) || bookmakerMarkets[0]
      const rest = bookmakerMarkets.filter((m) => m !== mainMarket && m !== compactMarket)
      bookmakerContent = (
        <>
          <div className="gdv2-bm-pair">
            {mainMarket && (
              <div className="gdv2-bm-main">
                <LadderMarket market={mainMarket} onOddClick={onOddClick} bookType="bookmaker" />
              </div>
            )}
            <div className="gdv2-bm-compact">
              <LadderMarket market={compactMarket} onOddClick={onOddClick} bookType="bookmaker" compact />
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
