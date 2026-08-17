import './style.css'
import MarketTitle from '../MarketTitle'
import MarketHeader from '../MarketHeader'
import OddBox from '../OddBox'
import MarketRemark from '../MarketRemark'
import { oddsByName, isSuspended, formatOdd, formatVol, formatMinMax } from '../utils'

export default function NumberMarket({ market, onOddClick, pl = {} }) {
  const sections = market.section.slice().sort((a, b) => a.sno - b.sno)
  const maxLabel = formatMinMax(market.min, market.max)

  return (
    <div className="gdv2-market-number">
      <MarketTitle title={market.mname} />
      <MarketHeader layout="number" minMaxLabel={maxLabel} />

      <div className="gdv2-market-body">
        {sections.map((section) => {
          const odds       = oddsByName(section)
          const suspended  = isSuspended(section)
          const runnerPl   = pl[section.fancyId]

          return (
            <div
              key={section.sid}
              className={`gdv2-number-row${suspended ? ' gdv2-number-suspended' : ''}`}
            >
              {/* Runner name */}
              <div className="gdv2-number-detail">
                <span className="gdv2-number-name">{section.nat}</span>
                {runnerPl?.pl !== 0 && runnerPl?.pl != null && (
                  <span className={`gdv2-runner-book ${runnerPl.pl < 0 ? 'gdv2-book-neg' : 'gdv2-book-pos'}`}>
                    {runnerPl.pl > 0 ? `+${runnerPl.pl}` : runnerPl.pl}
                  </span>
                )}
              </div>

              {/* gdv2-fancy-right wrapper with OddBox rendering numbers behind lock overlay */}
              <div className="gdv2-fancy-right">
                <div className="gdv2-fancy-odds">
                  <OddBox
                    odd={formatOdd(odds.back1)}
                    volume={formatVol(odds.back1)}
                    variant="back"
                    suspended={suspended}
                    onClick={() => onOddClick(section.nat, formatOdd(odds.back1), 'back', [section.nat], { fancyId: section.fancyId })}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <MarketRemark text={market.rem} />
    </div>
  )
}
