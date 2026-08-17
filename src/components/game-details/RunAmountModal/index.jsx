import { Modal } from 'react-bootstrap'
import { useGetFancyBookQuery } from '../../../store/api/authApi'
import './style.css'

export default function RunAmountModal({ show, onHide, fancyId }) {
  const { data: book, isFetching } = useGetFancyBookQuery(fancyId, { skip: !show || !fancyId })

  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="run-amount-modal-top"
      backdropClassName="run-amount-backdrop"
      centered
    >
      <div className="modal-header">
        <div className="modal-title h4">Run Amount</div>
        <button type="button" className="btn-close" aria-label="Close" onClick={onHide}></button>
      </div>
      <div className="modal-body">
        <table className="gdv2-run-amount-table">
          <thead>
            <tr>
              <th>Run</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <tr><td colSpan={2} style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : !book?.length ? (
              <tr><td colSpan={2} style={{ textAlign: 'center' }}>No data</td></tr>
            ) : (
              book.map((row, idx) => (
                <tr key={row.value ?? idx}>
                  <td>{row.value}</td>
                  <td
                    style={{ textAlign: 'right' }}
                    className={row.profit < 0 ? 'gdv2-run-amount-neg' : 'gdv2-run-amount-pos'}
                  >
                    {row.profit}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Modal>
  )
}
