import './style.css'

export default function MarketTitle({ title, showCashout = false }) {
  return (
    <div className="gdv2-market-title">
      <span className="gdv2-market-title-text">{title}</span>
      {showCashout && (
        <button className="gdv2-cashout-btn" disabled>Cashout</button>
      )}
    </div>
  )
}
