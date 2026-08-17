import { Fragment } from 'react'
import './style.css'
import MarketTitle from '../MarketTitle'
import MarketHeader from '../MarketHeader'
import OddBox from '../OddBox'
import MinMaxLabel from '../MinMaxLabel'
import MarketRemark from '../MarketRemark'
import { oddsByName, isSuspended, getSuspendedStatus, formatOdd, formatVol } from '../utils'

export default function FancyMarket({ market, onOddClick, pl = {} }) {
  const sections = market.section.slice().sort((a, b) => a.sno - b.sno)
  const hasLay   = sections.some((s) => oddsByName(s).lay1)
  const isFullWidth = (market.mname || '').toLowerCase().includes('over by over')

  const fullCls = isFullWidth ? ' gdv2-full-width' : ''
  const colCls  = isFullWidth ? 'gdv2-fancy-full-col' : 'gdv2-fancy-col'

  return (
    <div className="gdv2-market-fancy">
      <MarketTitle title={market.mname} />

      {/* Column headers */}
      <div className={`gdv2-fancy-header-row${fullCls}`}>
        <div className={colCls}>
          <MarketHeader layout="fancy" hasLay={hasLay} />
        </div>
        {!isFullWidth && (
          <div className={`${colCls} gdv2-fancy-second-header`}>
            <MarketHeader layout="fancy" hasLay={hasLay} />
          </div>
        )}
      </div>

      {/* Rows */}
      <div className="gdv2-market-body" data-title={market.status}>
        <div className={`gdv2-fancy-grid${fullCls}`}>
          {sections.map((section) => {
            const odds       = oddsByName(section)
            const suspended  = isSuspended(section)
            const statusText = getSuspendedStatus(section, market.status || 'SUSPENDED')
            const runnerPl   = pl[section.fancyId]

            return (
              <Fragment key={section.sid}>
                <div className={colCls}>
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

                      {/*
                        gdv2-fancy-right — the suspended overlay covers THIS wrapper,
                        displaying the dynamic API statusText (SUSPENDED, BALL RUNNING, etc.).
                      */}
                      <div className="gdv2-fancy-right" data-title={suspended ? statusText : undefined}>
                        <div className="gdv2-fancy-odds">
                          {hasLay && (
                            <OddBox
                              odd={formatOdd(odds.lay1)}
                              volume={formatVol(odds.lay1)}
                              variant="lay"
                              disabled={suspended}
                              onClick={() => onOddClick(section.nat, formatOdd(odds.lay1), 'lay', [section.nat], { fancyId: section.fancyId })}
                            />
                          )}
                          <OddBox
                            odd={formatOdd(odds.back1)}
                            volume={formatVol(odds.back1)}
                            variant="back"
                            disabled={suspended}
                            onClick={() => onOddClick(section.nat, formatOdd(odds.back1), 'back', [section.nat], { fancyId: section.fancyId })}
                          />
                        </div>
                        <div className="gdv2-minmax-wrap">
                          <MinMaxLabel min={section.min} max={section.max} />
                        </div>
                      </div>

                    </div>
                  </div>
                  {section.rem && <MarketRemark text={section.rem} />}
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>
      <MarketRemark text={market.rem} />
    </div>
  )
}
