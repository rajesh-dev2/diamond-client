import { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import './game-details/Sidebar/style.css'

export default function PlaceBetModal({ show, onHide, betData, onPlaceBet }) {
  const [selectedRunner, setSelectedRunner] = useState('')
  const [odds, setOdds] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (betData) {
      setSelectedRunner(betData.runnerName || '')
      setOdds(betData.odds || '1.00')
      setAmount('')
    }
  }, [betData])

  if (!betData) return null

  const betType = betData.type || 'back'

  const handleOddsChange = (delta) => {
    const numericOdds = parseFloat(odds) || 0
    const newOdds = Math.max(1.01, (numericOdds + delta)).toFixed(2)
    setOdds(newOdds)
  }

  const handleAddStake = (val) => {
    const currentAmount = parseFloat(amount) || 0
    setAmount((currentAmount + val).toString())
  }

  const handleClear = () => {
    setAmount('')
  }

  const handleReset = () => {
    setOdds(betData.odds || '1.00')
    setAmount('')
  }

  const numericOdds = parseFloat(odds) || 0
  const numericAmount = parseFloat(amount) || 0
  const profit = numericAmount > 0 ? (numericAmount * (numericOdds > 1 ? numericOdds - 1 : 1)).toFixed(2) : '0'

  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="place-bet-modal-top"
      backdropClassName="place-bet-backdrop"
    >
      <div className="modal-header">
        <div className="modal-title h4">Place Bet</div>
        <button type="button" className="btn-close-custom" aria-label="Close" onClick={onHide}>
          ✕
        </button>
      </div>

      <div className="modal-body p-0">
        <div className={`gdv2-bet-box gdv2-bet-${betType}`}>
          {/* Header labels */}
          <div className="gdv2-bet-header">
            <div className="gdv2-bet-for">(Bet for)</div>
            <div className="gdv2-bet-odds-label">Odds</div>
            <div className="gdv2-bet-stake-label">Stake</div>
            <div className="gdv2-bet-profit-label">Profit</div>
          </div>

          {/* Body inputs */}
          <div className="gdv2-bet-body">
            <div className="gdv2-bet-for"><span>{selectedRunner}</span></div>

            <div className="gdv2-bet-odds-input">
              <div className="gdv2-odds-group">
                <input type="text" disabled value={odds || '-'} className="gdv2-odds-field" readOnly />
                <div className="gdv2-odds-spinner">
                  <button type="button" onClick={() => handleOddsChange(0.01)}>
                    <i className="fa fa-angle-up" />
                  </button>
                  <button type="button" onClick={() => handleOddsChange(-0.01)}>
                    <i className="fa fa-angle-down" />
                  </button>
                </div>
              </div>
            </div>

            <div className="gdv2-bet-stake-input">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="gdv2-stake-field"
              />
            </div>

            <div className="gdv2-bet-profit">{profit}</div>
          </div>

          {/* Quick-add */}
          <div className="gdv2-bet-buttons">
            {[1000, 2000, 5000, 10000, 20000, 25000, 50000, 75000].map((val) => (
              <button key={val} type="button" className="gdv2-btn-stake" onClick={() => handleAddStake(val)}>
                +{val >= 1000 ? `${val / 1000}k` : val}
              </button>
            ))}
            <button type="button" className="gdv2-btn-clear" onClick={handleClear}>clear</button>
          </div>

          {/* Actions */}
          <div className="gdv2-bet-actions">
            <div><button type="button" className="gdv2-btn-edit">Edit</button></div>
            <div>
              <button type="button" className="gdv2-btn-reset" onClick={handleReset}>Reset</button>
              <button
                type="button"
                className="gdv2-btn-submit"
                disabled={!amount || parseFloat(amount) <= 0}
                onClick={() => {
                  if (onPlaceBet) {
                    onPlaceBet({ runner: selectedRunner, odds, amount })
                  }
                  onHide()
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

