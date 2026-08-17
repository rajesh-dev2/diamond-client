export default function MyBetsSidebar({ bets = [] }) {
  return (
    <div className="gdv2-sidebar-box gdv2-mybets-container">
      <div className="gdv2-sidebar-title"><h4>My Bet</h4></div>
      <div className="gdv2-mybets-table-wrap">
        <table className="gdv2-mybets-table">
          <thead>
            <tr>
              <th>Matched Bet</th>
              <th style={{ textAlign: 'right' }}>Odds</th>
              <th style={{ textAlign: 'right' }}>Stake</th>
            </tr>
          </thead>
          <tbody>
            {bets.map((bet) => (
              <tr
                key={`${bet.mid}-${bet.sid}-${bet.createdAt}`}
                className={bet.otype === 'lay' ? 'gdv2-bet-row-lay' : 'gdv2-bet-row-back'}
              >
                <td>{bet.nat} ({bet.otype})</td>
                <td style={{ textAlign: 'right' }}>{bet.odds}</td>
                <td style={{ textAlign: 'right' }}>{bet.stake}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
