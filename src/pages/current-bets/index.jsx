import { useState, useEffect } from 'react'
import { useGetCurrentBetsQuery } from '../../store/api/authApi'
import './style.css'

export default function CurrentBets() {
  const [reportType, setReportType] = useState('1')
  const [entriesCount, setEntriesCount] = useState(10)
  const [filter, setFilter] = useState('all')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectAll, setSelectAll] = useState(false)
  const [page, setPage] = useState(1)

  // Debounce free-text search so we don't fire a request on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Reset to page 1 whenever a filter changes.
  useEffect(() => {
    setPage(1)
  }, [reportType, entriesCount, filter, searchQuery])

  const { data, isFetching } = useGetCurrentBetsQuery({
    type: reportType === '2' ? 'casino' : 'sports',
    otype: filter,
    search: searchQuery,
    limit: entriesCount,
    page,
  })

  const rows = data?.rows || []
  const total = data?.total || 0
  const totalPages = Math.max(1, Math.ceil(total / entriesCount))
  const totalAmount = rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0)

  const handleSubmit = (e) => {
    e.preventDefault()
  }

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
                <div>Total Bets: <span className="me-2">{total}</span> Total Amount: <span className="me-2">{totalAmount}</span></div>
              </div>

              <div className="col-lg-2 col-5">
                <div className="mb-2 input-group position-relative">
                  <span className="me-2">Search:</span>
                  <input
                    type="search"
                    className="form-control"
                    placeholder={`${total} records...`}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
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
                  {isFetching ? (
                    <tr role="row">
                      <td colSpan={6} className="text-center">Loading…</td>
                    </tr>
                  ) : rows.length > 0 ? (
                    rows.map((row, index) => (
                      <tr key={row.id || row._id || index} role="row">
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
                  ) : (
                    <tr role="row">
                      <td colSpan={6} className="text-center">No records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="row row5 mt-2 justify-content-between align-items-center">
                <div className="col-auto">Page {page} of {totalPages}</div>
                <div className="col-auto d-flex gap-2">
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
    </div>
  )
}
