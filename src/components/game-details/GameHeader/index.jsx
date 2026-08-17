import './style.css'

export default function GameHeader({ title, date }) {
  return (
    <div className="gdv2-game-header">
      <span className="gdv2-game-title">{title}</span>
      <span className="gdv2-game-date">{date}</span>
    </div>
  )
}
