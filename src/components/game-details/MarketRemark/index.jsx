import './style.css'

export default function MarketRemark({ text }) {
  if (!text) return null
  return (
    <div className="gdv2-remark-row">
      <p className="gdv2-remark-text">{text}</p>
    </div>
  )
}
