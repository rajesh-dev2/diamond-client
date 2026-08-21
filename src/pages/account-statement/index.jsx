import { useState, useEffect, forwardRef } from 'react'
import DatePicker from 'react-datepicker'
import { createPortal } from 'react-dom'
import { useGetAccountStatementQuery } from '../../store/api/authApi'
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

const formatDateParam = (date) => {
  if (!date) return ''
  if (typeof date === 'string') return date
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function AccountStatement() {
  const [startDate, setStartDate] = useState(new Date(2026, 7, 10)) // 10/08/2026
  const [endDate, setEndDate] = useState(new Date(2026, 7, 17))   // 17/08/2026
  const [reportType, setReportType] = useState('sport')
  const [entriesCount, setEntriesCount] = useState(10)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  // Filters actually submitted
  const [activeFilters, setActiveFilters] = useState({
    startDate: new Date(2026, 7, 10),
    endDate: new Date(2026, 7, 17),
    reportType: 'sport',
  })

  // Debounce free-text search
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Reset to page 1 on filter or search changes
  useEffect(() => {
    setPage(1)
  }, [activeFilters, entriesCount, searchQuery])

  const { data, isFetching } = useGetAccountStatementQuery({
    type: activeFilters.reportType,
    from: formatDateParam(activeFilters.startDate),
    to: formatDateParam(activeFilters.endDate),
    limit: entriesCount,
    page,
    search: searchQuery,
  })

  const rows = Array.isArray(data?.rows) ? data.rows : Array.isArray(data) ? data : []
  const total = data?.total ?? rows.length
  const totalPages = Math.max(1, Math.ceil(total / entriesCount))

  const handleSubmit = (e) => {
    e.preventDefault()
    setActiveFilters({
      startDate,
      endDate,
      reportType,
    })
  }

  return (
    <div className="report-page">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Account Statement</h4>
        </div>
        <div className="card-body">
          {/* Filter Form Row matching reference */}
          <form className="report-filter-form" onSubmit={handleSubmit}>
            <div style={{ width: '150px' }}>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                customInput={<CustomDateInput />}
                popperContainer={({ children }) => createPortal(children, document.body)}
                popperPlacement="bottom-start"
              />
            </div>

            <div style={{ width: '150px' }}>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                customInput={<CustomDateInput />}
                popperContainer={({ children }) => createPortal(children, document.body)}
                popperPlacement="bottom-start"
              />
            </div>

            <div style={{ width: '230px' }}>
              <select
                className="form-select"
                name="type"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="deposit-withdraw">Deposite/Withdraw Reports</option>
                <option value="sport">Sport Report</option>
                <option value="casino">Casino Reports</option>
                <option value="third-party-casino">Third-Party Casino Reports</option>
              </select>
            </div>

            <div>
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
                placeholder={`${total} records...`}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
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
                {isFetching ? (
                  <tr role="row">
                    <td colSpan={6} className="text-center">Loading…</td>
                  </tr>
                ) : rows.length > 0 ? (
                  rows.map((row, index) => (
                    <tr key={row.id || row._id || index} role="row">
                      <td className="report-date">{row.date || row.createdAt || '-'}</td>
                      <td className="report-sr text-end">{row.srNo ?? index + 1 + (page - 1) * entriesCount}</td>
                      <td className="report-amount text-end">{row.credit || '-'}</td>
                      <td className="report-amount text-end">{row.debit || '-'}</td>
                      <td className="report-amount text-end">{row.pts ?? '-'}</td>
                      <td>{row.remark || '-'}</td>
                    </tr>
                  ))
                ) : null}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-2">
              <div>Page {page} of {totalPages}</div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
