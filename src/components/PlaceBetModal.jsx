import { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'

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

  const runnerList = betData.runnersList || ['Australia', 'Bangladesh', 'The Draw']
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
          <button type="button" className="btn-close" aria-label="Close" onClick={onHide}></button>
        </div>
        <div className="modal-body">
          <div className={`place-bet-modal ${betType}`}>
            <div className="row row5">
              <div className="col-6"><b>{selectedRunner}</b></div>
              <div className="col-6 text-end"><span>Profit: {profit}</span></div>
            </div>
            <div className="odd-stake-box">
              <div className="row row5 mt-1">
                <div className="col-6 text-center">Odds</div>
                <div className="col-6 text-center">Amount</div>
              </div>
              <div className="row row5 mt-1">
                <div className="col-6">
                  <div className="float-end">
                    <button type="button" className="stakeactionminus btn" onClick={() => handleOddsChange(-0.01)}>
                      <span className="fa fa-minus"></span>
                    </button>
                    <input
                      type="text"
                      className="stakeinput"
                      disabled
                      value={odds}
                      onChange={(e) => setOdds(e.target.value)}
                    />
                    <button type="button" className="stakeactionminus btn" onClick={() => handleOddsChange(0.01)}>
                      <span className="fa fa-plus"></span>
                    </button>
                  </div>
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    className="stakeinput w-100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="place-bet-buttons mt-1">
              <button type="button" className="btn btn-place-bet" onClick={() => handleAddStake(1000)}>+1k</button>
              <button type="button" className="btn btn-place-bet" onClick={() => handleAddStake(2000)}>+2k</button>
              <button type="button" className="btn btn-place-bet" onClick={() => handleAddStake(5000)}>+5k</button>
              <button type="button" className="btn btn-place-bet" onClick={() => handleAddStake(10000)}>+10k</button>
              <button type="button" className="btn btn-place-bet" onClick={() => handleAddStake(20000)}>+20k</button>
              <button type="button" className="btn btn-place-bet" onClick={() => handleAddStake(25000)}>+25k</button>
              <button type="button" className="btn btn-place-bet" onClick={() => handleAddStake(50000)}>+50k</button>
              <button type="button" className="btn btn-place-bet" onClick={() => handleAddStake(75000)}>+75k</button>
            </div>
            <div className="mt-1 place-bet-btn-box">
              <button type="button" className="btn btn-link" onClick={handleClear}>Clear</button>
              <button type="button" className="btn btn-info">Edit</button>
              <button type="button" className="btn btn-danger" onClick={handleReset}>Reset</button>
              <button
                type="button"
                className="btn btn-success"
                disabled={!amount || parseFloat(amount) <= 0}
                onClick={() => {
                  if (onPlaceBet) {
                    onPlaceBet({ runner: selectedRunner, odds, amount })
                  }
                  onHide()
                }}
              >
                Place Bet
              </button>
            </div>
            <div className="mt-1 d-flex"></div>
            <div className="odds-count mt-1">
              {runnerList.map((runner, idx) => (
                <div
                  key={idx}
                  className="row row5 mt-2"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedRunner(runner)}
                >
                  <div className="col-6"><span>{runner}</span></div>
                  <div className="col-3 text-center"></div>
                  <div className="col-3 text-end"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </Modal>
  )
}
