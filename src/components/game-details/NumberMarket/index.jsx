import './style.css'
import MarketTitle from '../MarketTitle'
import MarketHeader from '../MarketHeader'
import OddBox from '../OddBox'
import MinMaxLabel from '../MinMaxLabel'
import MarketRemark from '../MarketRemark'
import { oddsByName, isSuspended, formatOdd, formatVol, formatMinMax } from '../utils'

/**
 * NumberMarket — Lambi / 0-9 / Combination / Number markets.
 *
 * Can be used in two modes:
 *  1. Direct Props (Casino / Custom):
 *     <NumberMarket title="Method Of Combination Goal" runners={COMBO_GOAL} dualColumn onOddClick={fn} />
 *
 *  2. Live Feed Object (Sports / Game Details):
 *     <NumberMarket market={marketObj} onOddClick={fn} pl={pl} />
 */
export default function NumberMarket({
  market,
  title,
  runners,
  dualColumn,
  onOddClick,
  pl = {},
}) {
  // ── Normalize data from either props or feed market object ─────
  const marketTitle = title || market?.mname || ''
  const isFeedMode  = Boolean(market?.section)

  const items = isFeedMode
    ? (market.section || []).slice().sort((a, b) => a.sno - b.sno).map((section) => {
        const odds      = oddsByName(section)
        const suspended = isSuspended(section)
        const runnerPl  = pl[section.fancyId]
        return {
          id: section.sid || section.fancyId,
          sid: section.sid,
          fancyId: section.fancyId,
          name: section.nat,
          back: formatOdd(odds.back1),
          vol: formatVol(odds.back1),
          min: section.min ?? market.min,
          max: section.max ?? market.max,
          suspended,
          pl: runnerPl?.pl,
          rawSection: section,
        }
      })
    : (runners || []).map((r) => ({
        id: r.id || r.name,
        name: r.name || r.nat,
        back: r.back != null ? String(r.back) : '-',
        vol: r.vol,
        min: r.min,
        max: r.max,
        suspended: Boolean(r.suspended),
        rawRunner: r,
      }))

  const hasMinMax = items.some((item) => item.min != null || item.max != null)
  const isDual    = dualColumn !== undefined ? dualColumn : (items.length > 8)

  const handleItemClick = (item) => {
    if (item.suspended || !onOddClick) return
    if (isFeedMode) {
      onOddClick(item.name, item.back, 'back', [item.name], { fancyId: item.fancyId })
    } else {
      onOddClick(item.rawRunner || item, 'back')
    }
  }

  return (
    <div className="gdv2-market-number gdv2-market-fancy">
      {marketTitle && <MarketTitle title={marketTitle} />}

      {/* Column header(s) */}
      {isDual ? (
        <div className="gdv2-fancy-header-row">
          <div className="gdv2-fancy-col">
            <MarketHeader layout="number" showSpacer={hasMinMax} />
          </div>
          <div className="gdv2-fancy-col gdv2-fancy-second-header">
            <MarketHeader layout="number" showSpacer={hasMinMax} />
          </div>
        </div>
      ) : (
        <div className="gdv2-fancy-header-row gdv2-full-width">
          <div className="gdv2-fancy-full-col">
            <MarketHeader layout="number" showSpacer={hasMinMax} />
          </div>
        </div>
      )}

      {/* Rows */}
      <div className="gdv2-market-body">
        <div className={`gdv2-fancy-grid${isDual ? '' : ' gdv2-full-width'}`}>
          {items.map((item) => (
            <div
              key={item.id}
              className={isDual ? 'gdv2-fancy-col' : 'gdv2-fancy-full-col'}
            >
              <div className={`gdv2-number-row${item.suspended ? ' gdv2-number-suspended' : ''}`}>
                {/* Runner Name & PL */}
                <div className="gdv2-number-detail">
                  <span className="gdv2-number-name" title={item.name}>{item.name}</span>
                  {item.pl !== 0 && item.pl != null && (
                    <span className={`gdv2-runner-book ${item.pl < 0 ? 'gdv2-book-neg' : 'gdv2-book-pos'}`}>
                      {item.pl > 0 ? `+${item.pl}` : item.pl}
                    </span>
                  )}
                </div>

                {/* Back Box + MinMax Column */}
                <div className="gdv2-fancy-right">
                  <div className="gdv2-fancy-odds">
                    <OddBox
                      odd={item.back}
                      volume={item.vol}
                      variant="back"
                      suspended={item.suspended}
                      onClick={() => handleItemClick(item)}
                    />
                  </div>
                  {(item.min != null || item.max != null) && (
                    <div className="gdv2-minmax-wrap">
                      <MinMaxLabel min={item.min} max={item.max} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {market?.rem && <MarketRemark text={market.rem} />}
    </div>
  )
}

