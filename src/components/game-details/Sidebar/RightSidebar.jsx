import PlaceBetSidebar from './PlaceBetSidebar'
import MyBetsSidebar from './MyBetsSidebar'

export default function RightSidebar({
  betData, odds, amount, profit, isPlacing,
  onOddsChange, onAmountChange, onAddStake, onClear, onReset, onSubmit, bets,
}) {
  return (
    <div className="gdv2-right-sidebar">
      <div className="gdv2-sidebar">
        <a className="gdv2-matka-link" href="/casino/worli3">
          <i className="fas fa-info-circle" />
          <div>Matka</div>
        </a>

        <div className="gdv2-sidebar-box">
          <div className="gdv2-sidebar-title"><h4>Live Match</h4></div>
        </div>

        <PlaceBetSidebar
          betData={betData} odds={odds} amount={amount} profit={profit} isPlacing={isPlacing}
          onOddsChange={onOddsChange} onAmountChange={onAmountChange}
          onAddStake={onAddStake} onClear={onClear} onReset={onReset} onSubmit={onSubmit}
        />

        <MyBetsSidebar bets={bets} />
      </div>
    </div>
  )
}
