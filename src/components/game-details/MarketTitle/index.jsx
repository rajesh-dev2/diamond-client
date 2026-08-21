import { Link } from 'react-router-dom'
import './style.css'

/**
 * MarketTitle
 * ───────────
 * @prop {string}          title        – Market name shown on the left
 * @prop {string|boolean}  rulesLink    – URL for Rules link or true (default: "/casino-results")
 * @prop {function}        onRulesClick – Optional click handler for Rules
 * @prop {string|number}   roundId      – Round ID displayed on the right
 * @prop {boolean}         showCashout  – Show a Cashout button (default: false)
 * @prop {ReactNode}       children     – Optional custom right-side content / slot
 */
export default function MarketTitle({
  title,
  rulesLink,
  onRulesClick,
  roundId,
  showCashout = false,
  children,
}) {
  const hasRules = Boolean(rulesLink || onRulesClick)
  const targetRulesLink = typeof rulesLink === 'string' ? rulesLink : '/casino-results'

  return (
    <div className="gdv2-market-title">
      {/* Left side: Title + inline Rules link */}
      <div className="gdv2-market-title-left">
        <span className="gdv2-market-title-text">{title}</span>
        {hasRules && (
          onRulesClick ? (
            <a className="gdv2-market-rules-link" onClick={onRulesClick} style={{ cursor: 'pointer' }}>
              Rules
            </a>
          ) : (
            <Link className="gdv2-market-rules-link" to={targetRulesLink}>
              Rules
            </Link>
          )
        )}
      </div>

      {/* Right side: Round ID / children / Cashout */}
      {(roundId || children || showCashout) && (
        <div className="gdv2-market-title-right">
          {roundId && (
            <span className="gdv2-market-round-id">
              Round ID: {roundId}
            </span>
          )}
          {children}
          {showCashout && (
            <button type="button" className="gdv2-cashout-btn" disabled>Cashout</button>
          )}
        </div>
      )}
    </div>
  )
}

