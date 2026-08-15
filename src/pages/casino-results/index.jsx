import { useState, forwardRef } from 'react'
import DatePicker from 'react-datepicker'
import { createPortal } from 'react-dom'
import './style.css'

// Custom input component matching HTML structure
const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
  <div className="mb-2 custom-datepicker" onClick={onClick} ref={ref}>
    <input 
      type="text" 
      className="form-control" 
      value={value} 
      readOnly 
    />
    <i className="far fa-calendar"></i>
  </div>
))

CustomDateInput.displayName = 'CustomDateInput'

export default function CasinoResults() {
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 7, 15)) // 15/08/2026
  const [casinoType, setCasinoType] = useState('')
  const [entriesCount, setEntriesCount] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [resultsData] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const filteredData = resultsData.filter((item) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      item.roundId?.toLowerCase().includes(q) ||
      item.winner?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="casino-results">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Casino Results</h4>
        </div>
        <div className="card-body">
          <div className="report-form">
            <form className="row row5" onSubmit={handleSubmit}>
              <div className="col-lg-2 col-md-3 col-6">
                <div className="react-datepicker-wrapper">
                  <div className="react-datepicker__input-container">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      dateFormat="dd/MM/yyyy"
                      customInput={<CustomDateInput />}
                      popperContainer={({ children }) => createPortal(children, document.body)}
                      popperPlacement="bottom-start"
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-4">
                <div className="mb-2 input-group position-relative">
                  <select 
                    className="form-select" 
                    name="type"
                    value={casinoType}
                    onChange={(e) => setCasinoType(e.target.value)}
                  >
                    <option value="" disabled>Select Casino Type</option>
                    <option value="1">Teenpatti</option>
                    <option value="2">32 Cards</option>
                    <option value="3">Baccarat</option>
                    <option value="4">Poker</option>
                    <option value="5">Lucky 7</option>
                    <option value="6">Dragon Tiger</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-2 col-md-2 d-grid">
                <button type="submit" className="btn btn-primary btn-block">Submit</button>
              </div>
            </form>
            <div className="row row10 mt-2 justify-content-between">
              <div className="col-lg-2 col-6">
                <div className="mb-2 input-group position-relative">
                  <span className="me-2">Show</span>
                  <select 
                    className="form-select"
                    value={entriesCount}
                    onChange={(e) => setEntriesCount(Number(e.target.value))}
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="50">50</option>
                  </select>
                  <span className="ms-2">Entries</span>
                </div>
              </div>
              <div className="col-lg-2 col-6">
                <div className="mb-2 input-group position-relative">
                  <span className="me-2">Search:</span>
                  <input 
                    type="search" 
                    className="form-control" 
                    placeholder="0 records..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-2 table-responsive">
              <table role="table" className="table table-bordered table-striped">
                <thead>
                  <tr role="row">
                    <th colSpan={1} role="columnheader" className="round-id-col">Round ID</th>
                    <th colSpan={1} role="columnheader">Winner</th>
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {filteredData.length > 0 ? (
                    filteredData.slice(0, entriesCount).map((row, index) => (
                      <tr key={index} role="row">
                        <td className="round-id-col">{row.roundId}</td>
                        <td>{row.winner}</td>
                      </tr>
                    ))
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
