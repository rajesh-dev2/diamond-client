import './style.css'

export default function Scorecard({ scoreData }) {
  // Default data from the screenshot
  const data = scoreData || {
    team1: { abbr: 'SL', runs: '32-2', overs: '8.2', crr: 'CRR 3.84' },
    team2: { abbr: 'IND', runs: '462-10', overs: '116.4', crr: '' },
    session: '3',
    status: 'SL trail by 430 runs',
    balls: [
      { run: '0' },
      { run: '0' },
      { run: '0' },
      { run: '1' },
      { run: '0' },
      { run: '0' },
    ],
  }

  return (
    <div className="gdv2-scorecard">
      <div className="gdv2-score-left">
        <div className="gdv2-score-team-row">
          <span className="gdv2-score-team-abbr">{data.team1.abbr}</span>
          <span className="gdv2-score-runs">
            {data.team1.runs} ({data.team1.overs})
          </span>
          <span className="gdv2-score-crr">{data.team1.crr}</span>
        </div>
        <div className="gdv2-score-team-row">
          <span className="gdv2-score-team-abbr">{data.team2.abbr}</span>
          <span className="gdv2-score-runs">
            {data.team2.runs} ({data.team2.overs})
          </span>
          <span className="gdv2-score-crr">{data.team2.crr}</span>
        </div>
      </div>

      <div className="gdv2-score-right">
        <div className="gdv2-score-status">
          <span>{data.session} | </span>
          <span>{data.status}</span>
        </div>
        <div className="gdv2-score-balls">
          {data.balls.map((b, i) => (
            <span
              key={i}
              className={[
                'gdv2-ball',
                b.isFour   ? 'gdv2-ball-four'   : '',
                b.isSix    ? 'gdv2-ball-six'    : '',
                b.isWicket ? 'gdv2-ball-wicket' : '',
              ].filter(Boolean).join(' ')}
            >
              {b.run}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
