import { useState } from 'react'
import './style.css'

export default function CurrentBets() {
  const [reportType, setReportType] = useState('1')
  const [entriesCount, setEntriesCount] = useState(10)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectAll, setSelectAll] = useState(false)
  const [betsData] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const filteredData = betsData.filter((item) => {
    if (filter === 'back' && item.type !== 'back') return false
    if (filter === 'lay' && item.type !== 'lay') return false
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      item.eventName?.toLowerCase().includes(q) ||
      item.nation?.toLowerCase().includes(q) ||
      item.userRate?.toString().includes(q) ||
      item.amount?.toString().includes(q) ||
      item.placeDate?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="current-bets">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Current Bets</h4>
        </div>
        <div className="card-body">
          <div className="report-form">
            <form className="row row5" onSubmit={handleSubmit}>
              <div className="col-lg-2 col-md-3">
                <div className="mb-2 input-group position-relative">
                  <select 
                    className="form-select" 
                    name="gtype"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option value="" disabled>Select Report Type</option>
                    <option value="1">Sports</option>
                    <option value="2">Casino</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-2 col-md-2 d-grid">
                <button type="submit" className="btn btn-primary btn-block">Submit</button>
              </div>
            </form>

            <div className="row row5 mt-2 justify-content-between align-items-center">
              <div className="col-lg-2 col-5">
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

              <div className="col-lg-4 col-md-6 col-7 text-center">
                <div className="form-check form-check-inline">
                  <input 
                    type="radio" 
                    className="form-check-input" 
                    id="all" 
                    name="filter" 
                    value="all" 
                    checked={filter === 'all'}
                    onChange={() => setFilter('all')}
                  />
                  <label className="form-check-label" htmlFor="all">All</label>
                </div>
                <div className="form-check form-check-inline">
                  <input 
                    type="radio" 
                    className="form-check-input" 
                    id="back" 
                    name="filter" 
                    value="back" 
                    checked={filter === 'back'}
                    onChange={() => setFilter('back')}
                  />
                  <label className="form-check-label" htmlFor="back">Back</label>
                </div>
                <div className="form-check form-check-inline">
                  <input 
                    type="radio" 
                    className="form-check-input" 
                    id="lay" 
                    name="filter" 
                    value="lay" 
                    checked={filter === 'lay'}
                    onChange={() => setFilter('lay')}
                  />
                  <label className="form-check-label" htmlFor="lay">Lay</label>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 text-left col-7">
                <div>Total Bets: <span className="me-2">0</span> Total Amount: <span className="me-2">0</span></div>
              </div>

              <div className="col-lg-2 col-5">
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
                    <th colSpan={1} role="columnheader">Event Name</th>
                    <th colSpan={1} role="columnheader">Nation</th>
                    <th colSpan={1} role="columnheader" className="report-amount text-end">User Rate</th>
                    <th colSpan={1} role="columnheader" className="report-amount text-end">Amount</th>
                    <th colSpan={1} role="columnheader" className="report-date">Place Date</th>
                    <th colSpan={1} role="columnheader" className="report-action">
                      <div className="text-end">
                        <div className="form-check form-check-inline me-0">
                          <input 
                            type="checkbox" 
                            className="form-check-input" 
                            title="Toggle All Current Page Rows Selected" 
                            style={{ cursor: 'pointer' }}
                            checked={selectAll}
                            onChange={(e) => setSelectAll(e.target.checked)}
                          />
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {filteredData.length > 0 ? (
                    filteredData.slice(0, entriesCount).map((row, index) => (
                      <tr key={index} role="row">
                        <td>{row.eventName}</td>
                        <td>{row.nation}</td>
                        <td className="report-amount text-end">{row.userRate}</td>
                        <td className="report-amount text-end">{row.amount}</td>
                        <td className="report-date">{row.placeDate}</td>
                        <td className="report-action text-end">
                          <input type="checkbox" className="form-check-input" checked={selectAll} onChange={() => {}} />
                        </td>
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
