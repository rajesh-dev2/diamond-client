import { useState, useEffect, forwardRef } from 'react'
import DatePicker from 'react-datepicker'
import { createPortal } from 'react-dom'
import { useGetActivityLogsQuery } from '../../store/api/authApi'
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

const formatDisplayDate = (val) => {
  if (!val) return '-'
  if (typeof val === 'string' && (val.includes('/') || val.includes(':'))) return val
  try {
    const d = new Date(val)
    if (isNaN(d.getTime())) return String(val)
    return d.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).replace(',', '')
  } catch {
    return String(val)
  }
}

export default function ActivityLog() {
  const [startDate, setStartDate] = useState(new Date(2026, 7, 10)) // 10/08/2026
  const [endDate, setEndDate] = useState(new Date(2026, 7, 17))   // 17/08/2026
  const [logType, setLogType] = useState('endlogin')
  const [entriesCount, setEntriesCount] = useState(10)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  // Filters actually submitted
  const [activeFilters, setActiveFilters] = useState({
    startDate: new Date(2026, 7, 10),
    endDate: new Date(2026, 7, 17),
    logType: 'endlogin',
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

  const { data, isFetching } = useGetActivityLogsQuery({
    startDate: formatDateParam(activeFilters.startDate),
    endDate: formatDateParam(activeFilters.endDate),
    type: activeFilters.logType,
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
      logType,
    })
  }

  const filteredData = rows.filter((item) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    const username = String(item.username || item.userName || item.userId || '').toLowerCase()
    const dateStr = String(item.date || item.createdAt || item.loginTime || '').toLowerCase()
    const ip = String(item.ipAddress || item.ip || item.ip_address || '').toLowerCase()
    return (
      username.includes(q) ||
      dateStr.includes(q) ||
      ip.includes(q)
    )
  })

  return (
    <div className="report-page activity-log">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Activity Log</h4>
        </div>
        <div className="card-body">
          {/* Filter Form Row */}
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
                value={logType}
                onChange={(e) => setLogType(e.target.value)}
              >
                <option value="" disabled>Select Log Type</option>
                <option value="endlogin">Login</option>
                <option value="password">Change Password</option>
              </select>
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
                  <th colSpan={1} role="columnheader">Username</th>
                  <th colSpan={1} role="columnheader">Date</th>
                  <th colSpan={1} role="columnheader">Ip Address</th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                {isFetching ? (
                  <tr role="row">
                    <td colSpan={3} className="text-center">Loading…</td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.slice(0, entriesCount).map((row, index) => (
                    <tr key={row.id || row._id || index} role="row">
                      <td>{row.username || row.userName || row.userId || '-'}</td>
                      <td>{formatDisplayDate(row.date || row.createdAt || row.loginTime || row.timestamp)}</td>
                      <td>{row.ipAddress || row.ip || row.ip_address || '-'}</td>
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
