import { Modal } from 'react-bootstrap'
import PlaceBetSidebar from './game-details/Sidebar/PlaceBetSidebar'

export default function PlaceBetModal({
  show, onHide, betData, odds, amount, profit, isPlacing,
  onOddsChange, onAmountChange, onAddStake, onClear, onReset, onSubmit,
}) {
  if (!betData) return null

  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="place-bet-modal-top"
      backdropClassName="place-bet-backdrop"
    >
      <div className="place-bet-modal-close-wrap">
        <button
          type="button"
          className="btn-close place-bet-modal-close"
          aria-label="Close"
          onClick={onHide}
        ></button>
        <PlaceBetSidebar
          betData={betData}
          odds={odds}
          amount={amount}
          profit={profit}
          isPlacing={isPlacing}
          onOddsChange={onOddsChange}
          onAmountChange={onAmountChange}
          onAddStake={onAddStake}
          onClear={onClear}
          onReset={onReset}
          onSubmit={onSubmit}
        />
      </div>
    </Modal>
  )
}
