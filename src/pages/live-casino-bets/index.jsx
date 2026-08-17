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

export default function LiveCasinoBets() {
  const [settledType, setSettledType] = useState('sattled')
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 7, 17)) // 17/08/2026
  const [casinoType, setCasinoType] = useState('')
  const [entriesCount, setEntriesCount] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [betsData] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const filteredData = betsData.filter((item) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      item.gameName?.toLowerCase().includes(q) ||
      item.type?.toLowerCase().includes(q) ||
      item.amount?.toString().includes(q) ||
      item.total?.toString().includes(q) ||
      item.date?.toLowerCase().includes(q) ||
      item.roundId?.toLowerCase().includes(q) ||
      item.transactionId?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="report-page live-casino-bets">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Live Casino Bets</h4>
        </div>
        <div className="card-body">
          {/* Filter Form Row */}
          <form className="report-filter-form" onSubmit={handleSubmit}>
            <div style={{ width: '150px' }}>
              <select 
                className="form-select" 
                name="reportType"
                value={settledType}
                onChange={(e) => setSettledType(e.target.value)}
              >
                <option value="" disabled>Select Report Type</option>
                <option value="sattled">Settled</option>
                <option value="un-sattled">Un-Settled</option>
              </select>
            </div>

            <div style={{ width: '150px' }}>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                customInput={<CustomDateInput />}
                popperContainer={({ children }) => createPortal(children, document.body)}
                popperPlacement="bottom-start"
              />
            </div>

            <div style={{ width: '200px' }}>
              <select 
                className="form-select" 
                name="type"
                value={casinoType}
                onChange={(e) => setCasinoType(e.target.value)}
              >
                <option value="" disabled>Select Casino Type</option>
                <option value="ezugi">Ezugi</option>
                <option value="ss">Super Spade</option>
                <option value="qt">Slot 3 | Holi</option>
                <option value="evo">Evolution</option>
                <option value="cockfight">CockFight</option>
                <option value="ludo">Ludo Classic</option>
                <option value="pop-the-ball">PopTheBall</option>
                <option value="binary">Binary</option>
                <option value="tgs">Slot 2</option>
                <option value="slot">Slot</option>
                <option value="tgslive">LuckyStreak</option>
                <option value="rummy">Rummy</option>
                <option value="ludo-lands">Ludo Lands</option>
                <option value="vivo">vivo gaming</option>
                <option value="snakes-and-ladders">snakes and ladders</option>
                <option value="bc">Creedroomz</option>
                <option value="smart">Smart Soft</option>
                <option value="astar">Astar Game</option>
                <option value="ds">Dragoon soft</option>
                <option value="tembo">Tembo</option>
                <option value="av">Spribe</option>
                <option value="bcslot">Pascal Game | Popok</option>
                <option value="lottery">Lottery</option>
                <option value="scratch">Scratch</option>
                <option value="darwin">Darwin</option>
                <option value="pg">Pocket Game</option>
                <option value="bet">Bet Core</option>
                <option value="jilli">Jili</option>
                <option value="win">Red Carat</option>
                <option value="gemini1">Gemini</option>
                <option value="amigo">Amigo</option>
                <option value="egt">EGT</option>
                <option value="studio21">Studio 21</option>
                <option value="beon">Beon Game</option>
                <option value="king">King Midas</option>
                <option value="avnew">Aviator</option>
              </select>
            </div>

            <div>
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
                  <th colSpan={1} role="columnheader" className="game-name">Game Name</th>
                  <th colSpan={1} role="columnheader" className="report-type">Type</th>
                  <th colSpan={1} role="columnheader" className="report-amount text-center">Amount</th>
                  <th colSpan={1} role="columnheader" className="report-amount text-center">Total</th>
                  <th colSpan={1} role="columnheader" className="report-date">Date</th>
                  <th colSpan={1} role="columnheader">Round Id</th>
                  <th colSpan={1} role="columnheader">Transaction Id</th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                {filteredData.length > 0 ? (
                  filteredData.slice(0, entriesCount).map((row, index) => (
                    <tr key={index} role="row">
                      <td className="game-name">{row.gameName}</td>
                      <td className="report-type">{row.type}</td>
                      <td className="report-amount text-center">{row.amount}</td>
                      <td className="report-amount text-center">{row.total}</td>
                      <td className="report-date">{row.date}</td>
                      <td>{row.roundId}</td>
                      <td>{row.transactionId}</td>
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
