import './style.css'
import MarketTitle from '../MarketTitle'
import MarketHeader from '../MarketHeader'
import RunnerRow from '../RunnerRow'
import OddBox from '../OddBox'
import MarketRemark from '../MarketRemark'
import {
  LADDER_COLUMNS,
  COMPACT_LADDER_COLUMNS,
  oddsByName,
  isSuspended,
  getSuspendedStatus,
  formatOdd,
  formatVol,
  bookBySid,
  formatMinMax,
} from '../utils'
import {
  useGetMatchOddsBookQuery,
  useGetBookmakerBookQuery,
} from '../../../store/api/authApi'

export default function LadderMarket({ market, onOddClick, bookType = 'match', compact = false, className = '' }) {
  const marketId = market?.marketId

  const { data: matchBook }    = useGetMatchOddsBookQuery(marketId, { skip: !marketId || bookType !== 'match'    })
  const { data: bookmakerBook } = useGetBookmakerBookQuery(marketId, { skip: !marketId || bookType !== 'bookmaker' })

  if (!market) return null

  const runnerNames = market.section.map((s) => s.nat)
  const maxLabel    = formatMinMax(market.min, market.max)
  const book        = bookBySid(bookType === 'match' ? matchBook : bookmakerBook)
  const columns     = compact ? COMPACT_LADDER_COLUMNS : LADDER_COLUMNS

  return (
    <div className={`gdv2-market-ladder ${className}`.trim()}>
      <MarketTitle title={market.mname} showCashout />
      <MarketHeader layout={compact ? 'compact' : 'ladder'} minMaxLabel={maxLabel} />

      <div className="gdv2-market-body" data-title={market.status}>
        {market.section.map((section) => {
          const odds       = oddsByName(section)
          const suspended  = isSuspended(section)
          const statusText = getSuspendedStatus(section, market.status || 'SUSPENDED')
          const runnerBook = book[String(section.sid)]

          return (
            <RunnerRow
              key={section.sid}
              name={section.nat}
              book={runnerBook?.profit ?? null}
              suspended={suspended}
              status={statusText}
            >
              {columns.map(({ key, cssClass, side, hideMobile }) => (
                <OddBox
                  key={key}
                  odd={formatOdd(odds[key])}
                  volume={formatVol(odds[key])}
                  variant={cssClass}
                  className={hideMobile ? 'gdv2-hide-mobile' : ''}
                  disabled={suspended}
                  onClick={() => onOddClick(
                    section.nat,
                    formatOdd(odds[key]),
                    side,
                    runnerNames,
                    { marketId: market.marketId, sid: String(section.sid) }
                  )}
                />
              ))}
            </RunnerRow>
          )
        })}
      </div>

      <MarketRemark text={market.rem} />
    </div>
  )
}
