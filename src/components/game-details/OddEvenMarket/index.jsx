import { Fragment } from 'react'
import './style.css'
import MarketTitle from '../MarketTitle'
import OddBox from '../OddBox'
import MinMaxLabel from '../MinMaxLabel'
import { oddsByName, isSuspended, getSuspendedStatus, formatOdd, formatVol } from '../utils'

export default function OddEvenMarket({ market, onOddClick, pl = {} }) {
  const sections = market.section.slice().sort((a, b) => a.sno - b.sno)

  return (
    <div className="gdv2-market-oddeven">
      <MarketTitle title={market.mname} />

      <div className="gdv2-market-body" data-title={market.status}>
        <div className="gdv2-fancy-grid">
          {sections.map((section) => {
            const odds       = oddsByName(section)
            const suspended  = isSuspended(section)
            const statusText = getSuspendedStatus(section, market.status || 'SUSPENDED')
            const runnerPl   = pl[section.fancyId]
            const secondOdd  = odds.lay1 || odds.back2

            return (
              <Fragment key={section.sid}>
                <div className="gdv2-fancy-col">
                  <div className={`gdv2-fancy-item${suspended ? ' gdv2-fancy-suspended' : ''}`}>
                    <div className="gdv2-fancy-row">

                      {/* Runner name + PL */}
                      <div className="gdv2-fancy-detail">
                        <span className="gdv2-fancy-name">{section.nat}</span>
                        {runnerPl?.pl !== 0 && runnerPl?.pl != null && (
                          <span className={`gdv2-runner-book ${runnerPl.pl < 0 ? 'gdv2-book-neg' : 'gdv2-book-pos'}`}>
                            {runnerPl.pl > 0 ? `+${runnerPl.pl}` : runnerPl.pl}
                          </span>
                        )}
                      </div>

                      {/* gdv2-fancy-right — suspended overlay covers this wrapper */}
                      <div className="gdv2-fancy-right" data-title={suspended ? statusText : undefined}>
                        <div className="gdv2-fancy-odds">
                          <OddBox
                            odd={formatOdd(odds.back1)}
                            volume={formatVol(odds.back1)}
                            variant="back"
                            disabled={suspended}
                            onClick={() => onOddClick(section.nat, formatOdd(odds.back1), 'back', [section.nat], { fancyId: section.fancyId })}
                          />
                          <OddBox
                            odd={formatOdd(secondOdd)}
                            volume={formatVol(secondOdd)}
                            variant="back"
                            disabled={suspended}
                            onClick={() => onOddClick(section.nat, formatOdd(secondOdd), 'back', [section.nat], { fancyId: section.fancyId })}
                          />
                        </div>
                        <div className="gdv2-minmax-wrap">
                          <MinMaxLabel min={section.min} max={section.max} />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}
