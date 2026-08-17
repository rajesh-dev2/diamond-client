import './style.css'
import { useGetButtonSettingsQuery } from '../../../store/api/authApi'
import { DEFAULT_GAME_BUTTONS } from '../../SetButtonValuesModal/defaultButtonValues'

export default function PlaceBetSidebar({
  betData, odds, amount, profit, isPlacing,
  onOddsChange, onAmountChange, onAddStake, onClear, onReset, onSubmit,
}) {
  const { data: settings } = useGetButtonSettingsQuery()
  const stakeButtons = settings?.gameButtons?.length ? settings.gameButtons : DEFAULT_GAME_BUTTONS

  if (!betData) return null

  return (
    <div className="gdv2-sidebar-box gdv2-place-bet-container">
      <div className="gdv2-sidebar-title"><h4>Place Bet</h4></div>

      <div className={`gdv2-bet-box gdv2-bet-${betData.type || 'back'}`}>
        {/* Header labels */}
        <div className="gdv2-bet-header">
          <div className="gdv2-bet-for">(Bet for)</div>
          <div className="gdv2-bet-odds-label">Odds</div>
          <div className="gdv2-bet-stake-label">Stake</div>
          <div className="gdv2-bet-profit-label">Profit</div>
        </div>

        {/* Body inputs */}
        <div className="gdv2-bet-body">
          <div className="gdv2-bet-for"><span>{betData.runnerName}</span></div>

          <div className="gdv2-bet-odds-input">
            <div className="gdv2-odds-group">
              <input type="text" disabled value={odds || '-'} className="gdv2-odds-field" readOnly />
              <div className="gdv2-odds-spinner">
                <button type="button" onClick={() => onOddsChange(0.01)}>
                  <i className="fa fa-angle-up" />
                </button>
                <button type="button" onClick={() => onOddsChange(-0.01)}>
                  <i className="fa fa-angle-down" />
                </button>
              </div>
            </div>
          </div>

          <div className="gdv2-bet-stake-input">
            <input
              type="number"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              className="gdv2-stake-field"
            />
          </div>

          <div className="gdv2-bet-profit">{profit}</div>
        </div>

        {/* Quick-add */}
        <div className="gdv2-bet-buttons">
          {stakeButtons.map((btn, idx) => (
            <button key={idx} type="button" className="gdv2-btn-stake" onClick={() => onAddStake(Number(btn.value))}>
              +{btn.label}
            </button>
          ))}
          <button type="button" className="gdv2-btn-clear" onClick={onClear}>clear</button>
        </div>

        {/* Actions */}
        <div className="gdv2-bet-actions">
          <div><button type="button" className="gdv2-btn-edit">Edit</button></div>
          <div>
            <button type="button" className="gdv2-btn-reset" onClick={onReset}>Reset</button>
            <button
              type="button"
              className="gdv2-btn-submit"
              disabled={!amount || parseFloat(amount) <= 0 || isPlacing}
              onClick={onSubmit}
            >
              Submit
            </button>
          </div>
        </div>

        {isPlacing && (
          <div className="gdv2-bet-loading-overlay">
            <span className="gdv2-spinner">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} style={{ '--i': i }} />
              ))}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
