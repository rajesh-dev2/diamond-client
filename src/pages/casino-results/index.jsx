import { useState, forwardRef } from 'react'
import { useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import { createPortal } from 'react-dom'
import './style.css'

// Custom input component matching HTML structure
const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
  <div className="custom-datepicker" onClick={onClick} ref={ref}>
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

const GAME_TYPE_MAP = {
  card32: '2',
  card32eu: '2',
  cards32: '2',
  teen62: '1',
  teen: '1',
  baccarat: '3',
  poker: '4',
  lucky7: '5',
  dt20: '6',
}

export default function CasinoResults() {
  const { gameId } = useParams()
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 7, 17)) // 17/08/2026
  const [casinoType, setCasinoType] = useState(gameId && GAME_TYPE_MAP[gameId] ? GAME_TYPE_MAP[gameId] : '')
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
    <div className="report-page casino-results">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Casino Results</h4>
        </div>
        <div className="card-body">
          {/* Filter Form Row */}
          <form className="report-filter-form" onSubmit={handleSubmit}>
            <div className="report-filter-dates-row">
              <div className="report-filter-item report-filter-date">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  customInput={<CustomDateInput />}
                  popperContainer={({ children }) => createPortal(children, document.body)}
                  popperPlacement="bottom-start"
                />
              </div>

              <div className="report-filter-item report-filter-select">
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

            <div className="report-filter-item report-filter-btn">
              <button type="submit" className="btn btn-primary btn-submit">Submit</button>
            </div>
          </form>

          {/* Table Controls */}
          <div className="report-controls-bar">
            <div className="report-show-entries">
              <span>Show</span>
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
              <span>Entries</span>
            </div>

            <div className="report-search-box">
              <span>Search:</span>
              <input 
                type="search" 
                className="form-control" 
                placeholder="0 records..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="table-responsive">
            <table role="table" className="table table-bordered">
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
  )
}
