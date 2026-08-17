import './style.css'

export default function RunnerRow({
  name,
  book = null,
  suspended = false,
  status = 'SUSPENDED',
  children,
}) {
  return (
    <div
      className={`gdv2-runner-row${suspended ? ' gdv2-suspended' : ''}`}
      data-title={suspended ? status : undefined}
    >
      <div className="gdv2-runner-detail">
        <span className="gdv2-runner-name">{name}</span>
        {book != null && (
          <span className={`gdv2-runner-book ${book < 0 ? 'gdv2-book-neg' : 'gdv2-book-pos'}`}>
            {book > 0 ? `+${book}` : book}
          </span>
        )}
      </div>
      <div
        className="gdv2-runner-odds"
        data-title={suspended ? status : undefined}
      >
        {children}
      </div>
    </div>
  )
}
