/**
 * CasinoNumbersGrid
 * ─────────────────
 * Reusable Numbers / Single Digit betting grid table (1 to 0) matching Casino UI reference:
 *   - Centered odds rate title on header (e.g. 9.5)
 *   - 5x2 grid layout (Row 1: 1, 2, 3, 4, 5 | Row 2: 6, 7, 8, 9, 0)
 *   - Bold serif number typography with casino back-odds blue background
 *   - Click handling for betting integration & suspended state support
 *
 * @param {Object} props
 * @param {string|number} [props.title='9.5']           - Title/Rate shown in header (e.g. 9.5)
 * @param {Array}         [props.items]                 - Array of number items [{ id, num, odds, suspended }]
 * @param {number}        [props.columns=5]             - Grid columns count (default: 5)
 * @param {Function}      [props.onBetClick]            - (runnerName, odds, type, isSuspended) => void
 * @param {string}        [props.className='']          - Additional wrapper class names
 */

import './style.css'

const DEFAULT_NUMBERS = [
  { id: 'n1', num: '1', odds: 9.5, suspended: false },
  { id: 'n2', num: '2', odds: 9.5, suspended: false },
  { id: 'n3', num: '3', odds: 9.5, suspended: false },
  { id: 'n4', num: '4', odds: 9.5, suspended: false },
  { id: 'n5', num: '5', odds: 9.5, suspended: false },
  { id: 'n6', num: '6', odds: 9.5, suspended: false },
  { id: 'n7', num: '7', odds: 9.5, suspended: false },
  { id: 'n8', num: '8', odds: 9.5, suspended: false },
  { id: 'n9', num: '9', odds: 9.5, suspended: false },
  { id: 'n0', num: '0', odds: 9.5, suspended: false },
]

export default function CasinoNumbersGrid({
  title = '9.5',
  items = DEFAULT_NUMBERS,
  columns = 5,
  onBetClick,
  className = '',
}) {
  const handleClick = (item) => {
    const isSuspended = Boolean(item.suspended || !item.odds || Number(item.odds) === 0)
    if (onBetClick) {
      onBetClick(`Number ${item.num}`, item.odds || title, 'back', isSuspended)
    }
  }

  return (
    <div className={`casino-numbers-box ${className}`.trim()}>
      {title && (
        <div className="casino-numbers-header">
          <b>{title}</b>
        </div>
      )}

      <div
        className="casino-numbers-grid"
        style={{ '--grid-cols': columns }}
      >
        {items.map((item) => {
          const isSuspended = Boolean(item.suspended || !item.odds || Number(item.odds) === 0)

          return (
            <div
              key={item.id || item.num}
              className={`casino-numbers-cell ${isSuspended ? 'suspended-box' : ''}`}
              onClick={() => handleClick(item)}
            >
              <span className="casino-numbers-digit">{item.num}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
