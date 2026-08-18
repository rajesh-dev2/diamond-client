/**
 * CasinoMarket
 * ────────────
 * Reusable betting market component built with game-details primitives:
 *   • MarketTitle   — teal title bar
 *   • MarketHeader  — column labels with perfect min-max spacer alignment
 *   • OddBox        — clickable odds cells (Back blue / Lay pink)
 *   • MinMaxLabel   — Min / Max stake labels
 *
 * Supports:
 *   • Standard markets: single column list
 *   • Combo / Number markets: 2-column grid (`gdv2-fancy-grid` + dual header)
 *
 * Props
 * ─────
 * @prop {string}   title      – Market title
 * @prop {Array}    runners    – [{ id, name, back, lay?, vol?, min?, max?, suspended? }]
 * @prop {boolean}  hasLay     – Show Lay column (default: true)
 * @prop {boolean}  combo      – Dual-column grid mode (default: false)
 * @prop {function} onOddClick – (runner, 'back'|'lay') → void
 */

import { Fragment } from 'react'
import MarketTitle from '../game-details/MarketTitle'
import MarketHeader from '../game-details/MarketHeader'
import OddBox from '../game-details/OddBox'
import MinMaxLabel from '../game-details/MinMaxLabel'
import '../game-details/FancyMarket/style.css'
import '../game-details/NumberMarket/style.css'
import './style.css'

function RunnerItem({ runner, hasLay, onOddClick }) {
  const suspended = Boolean(runner.suspended)
  const statusText = runner.suspendedLabel || 'SUSPENDED'

  return (
    <div className={`gdv2-fancy-item${suspended ? ' gdv2-fancy-suspended' : ''}`}>
      <div className="gdv2-fancy-row">
        {/* Runner name */}
        <div className="gdv2-fancy-detail">
          <span className="gdv2-fancy-name" title={runner.name}>{runner.name}</span>
        </div>

        {/* Odds & Min/Max wrapper with suspended lock/status */}
        <div className="gdv2-fancy-right" data-title={suspended && runner.showStatusOverlay ? statusText : undefined}>
          <div className="gdv2-fancy-odds">
            <OddBox
              variant="back"
              odd={runner.back != null ? String(runner.back) : '-'}
              volume={runner.vol}
              suspended={suspended}
              onClick={() => !suspended && onOddClick(runner, 'back')}
            />
            {hasLay && (
              <OddBox
                variant="lay"
                odd={runner.lay != null ? String(runner.lay) : '-'}
                volume={runner.vol}
                suspended={suspended}
                onClick={() => !suspended && onOddClick(runner, 'lay')}
              />
            )}
          </div>
          {(runner.min != null || runner.max != null) && (
            <div className="gdv2-minmax-wrap">
              <MinMaxLabel min={runner.min} max={runner.max} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CasinoMarket({
  title,
  runners = [],
  hasLay = true,
  combo = false,
  onOddClick,
}) {
  const hasMinMax = runners.some((r) => r.min != null || r.max != null)
  const headerLayout = hasLay ? 'compact' : 'number'

  // ── 2-Column Combo / Number Market (Image 3) ───────────────
  if (combo) {
    return (
      <div className="gdv2-market-fancy">
        {title && <MarketTitle title={title} />}

        {/* Dual-column header */}
        <div className="gdv2-fancy-header-row">
          <div className="gdv2-fancy-col">
            <MarketHeader layout={headerLayout} hasLay={hasLay} showSpacer={hasMinMax} />
          </div>
          <div className="gdv2-fancy-col gdv2-fancy-second-header">
            <MarketHeader layout={headerLayout} hasLay={hasLay} showSpacer={hasMinMax} />
          </div>
        </div>

        {/* Dual-column items grid */}
        <div className="gdv2-market-body">
          <div className="gdv2-fancy-grid">
            {runners.map((r) => (
              <div key={r.id} className="gdv2-fancy-col">
                <RunnerItem runner={r} hasLay={hasLay} onOddClick={onOddClick} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Standard Market (Single column list) ────────────────────
  return (
    <div className="gdv2-market-fancy">
      {title && <MarketTitle title={title} />}
      <div className="gdv2-fancy-header-row gdv2-full-width">
        <div className="gdv2-fancy-full-col">
          <MarketHeader layout={headerLayout} hasLay={hasLay} showSpacer={hasMinMax} />
        </div>
      </div>

      <div className="gdv2-market-body">
        <div className="gdv2-fancy-grid gdv2-full-width">
          {runners.map((r) => (
            <div key={r.id} className="gdv2-fancy-full-col">
              <RunnerItem runner={r} hasLay={hasLay} onOddClick={onOddClick} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


