import { Link } from 'react-router-dom'
import './style.css'

/**
 * CasinoLastResults
 * ─────────────────
 * Reusable Last Results bar & badge container component used across casino games.
 *
 * Renders:
 *   <div className="casino-last-result-wrapper ...">
 *     <div className="casino-last-result-title ...">
 *       <span>{title}</span>
 *       <span><Link to={viewAllLink}>View All</Link></span>
 *     </div>
 *     <div className="casino-last-results ...">
 *       {children || results}
 *     </div>
 *   </div>
 *
 * @prop {string}         [title="Last Result"]          – Title text on the left
 * @prop {string}         [viewAllLink="/casino-results"] – Route path for 'View All' link
 * @prop {function}       [onViewAllClick]               – Optional click handler for 'View All' (overrides Link)
 * @prop {Array}          [results]                      – Array of result items (strings or objects)
 * @prop {function}       [renderResult]                 – Custom result item renderer: (item, index) => ReactNode
 * @prop {function}       [onResultClick]                – Click handler for a result item: (item, index) => void
 * @prop {string}         [className=""]                 – Extra CSS class for outer wrapper
 * @prop {string}         [titleClassName=""]            – Extra CSS class for title container
 * @prop {string}         [resultsClassName=""]          – Extra CSS class for results container (e.g. 'matka-result')
 * @prop {React.ReactNode}[children]                     – Custom badges/pills to render inside .casino-last-results
 */
export default function CasinoLastResults({
  title = 'Last Result',
  viewAllLink = '/casino-results',
  onViewAllClick,
  results,
  renderResult,
  onResultClick,
  className = '',
  titleClassName = '',
  resultsClassName = '',
  children,
}) {
  const wrapperClass = `casino-last-result-wrapper ${className}`.trim()
  const titleClass = `casino-last-result-title ${titleClassName}`.trim()
  const resultsClass = `casino-last-results ${resultsClassName}`.trim()

  return (
    <div className={wrapperClass}>
      {/* Title Bar */}
      <div className={titleClass}>
        <span>{title}</span>
        <span>
          {onViewAllClick ? (
            <a onClick={onViewAllClick} style={{ cursor: 'pointer' }}>
              View All
            </a>
          ) : (
            <Link to={viewAllLink} data-discover="true">View All</Link>
          )}
        </span>
      </div>

      {/* Results Badges Container */}
      <div className={resultsClass}>
        {children ? (
          children
        ) : results && results.length > 0 ? (
          results.map((res, idx) => {
            if (renderResult) {
              return renderResult(res, idx)
            }

            if (typeof res === 'object' && res !== null) {
              const winnerStr = res.winner ? String(res.winner) : ''
              const winnerKey = winnerStr.toLowerCase()
              return (
                <span
                  key={res.id || idx}
                  className={`result result-${winnerKey}`}
                  onClick={() => onResultClick && onResultClick(res, idx)}
                  title={
                    res.roundId
                      ? `Round: ${res.roundId} | Winner: ${res.winner}`
                      : undefined
                  }
                >
                  {winnerStr || res.label || res.result}
                </span>
              )
            }

            const valStr = String(res)
            const valKey = valStr.toLowerCase()
            return (
              <span
                key={idx}
                className={`result result-${valKey}`}
                onClick={() => onResultClick && onResultClick(res, idx)}
              >
                {valStr}
              </span>
            )
          })
        ) : null}
      </div>
    </div>
  )
}
