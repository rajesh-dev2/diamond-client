import { useState, forwardRef } from 'react'
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

export default function AccountStatement() {
  const [startDate, setStartDate] = useState(new Date(2026, 7, 10)) // 10/08/2026
  const [endDate, setEndDate] = useState(new Date(2026, 7, 17))   // 17/08/2026
  const [reportType, setReportType] = useState('1')
  const [entriesCount, setEntriesCount] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [statementData] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const filteredData = statementData.filter((item) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      item.date?.toLowerCase().includes(q) ||
      item.srNo?.toString().includes(q) ||
      item.remark?.toLowerCase().includes(q) ||
      item.credit?.toString().includes(q) ||
      item.debit?.toString().includes(q) ||
      item.pts?.toString().includes(q)
    )
  })

  return (
    <div className="report-page">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Account Statement</h4>
        </div>
        <div className="card-body">
          {/* Filter Form Row matching reference */}
          <form className="report-filter-form" onSubmit={handleSubmit}>
            <div className="report-filter-dates-row">
              <div className="report-filter-item report-filter-date">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  customInput={<CustomDateInput />}
                  popperContainer={({ children }) => createPortal(children, document.body)}
                  popperPlacement="bottom-start"
                />
              </div>

              <div className="report-filter-item report-filter-date">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  customInput={<CustomDateInput />}
                  popperContainer={({ children }) => createPortal(children, document.body)}
                  popperPlacement="bottom-start"
                />
              </div>
            </div>

            <div className="report-filter-item report-filter-select">
              <select 
                className="form-select" 
                name="type"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="" disabled>Select Report Type</option>
                <option value="1">Deposite/Withdraw Reports</option>
                <option value="2">Sport Report</option>
                <option value="3">Casino Reports</option>
                <option value="4">Third-Party Casino Reports</option>
              </select>
            </div>

            <div className="report-filter-item report-filter-btn">
              <button type="submit" className="btn btn-primary btn-submit">Submit</button>
            </div>
          </form>

          {/* Table Controls (Show entries + Search) */}
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
                  <th colSpan={1} role="columnheader" className="report-date">Date</th>
                  <th colSpan={1} role="columnheader" className="report-sr text-end">Sr no</th>
                  <th colSpan={1} role="columnheader" className="report-amount text-end">Credit</th>
                  <th colSpan={1} role="columnheader" className="report-amount text-end">Debit</th>
                  <th colSpan={1} role="columnheader" className="report-amount text-end">Pts</th>
                  <th colSpan={1} role="columnheader">Remark</th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                {filteredData.length > 0 ? (
                  filteredData.slice(0, entriesCount).map((row, index) => (
                    <tr key={index} role="row">
                      <td className="report-date">{row.date}</td>
                      <td className="report-sr text-end">{row.srNo}</td>
                      <td className="report-amount text-end">{row.credit || '-'}</td>
                      <td className="report-amount text-end">{row.debit || '-'}</td>
                      <td className="report-amount text-end">{row.pts}</td>
                      <td>{row.remark}</td>
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
