import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { message } from 'antd'
import { useGetSportsQuery, useGetEventsQuery } from '../../store/api/authApi'
import './style.css'

// Home page (BetTable) jaisa hi grouping — events ko unki `series` (league
// name) ke hisaab se group karo, taaki sidebar tree "Sport > League > Match"
// shape dikha sake, jaisa pehle hardcoded data mein tha, lekin ab real
// live data se.
function groupEventsBySeries(events) {
  const bySeries = new Map()
  for (const event of events || []) {
    const key = event.series || 'Other'
    if (!bySeries.has(key)) bySeries.set(key, [])
    bySeries.get(key).push(event)
  }
  return Array.from(bySeries.entries()).map(([name, matches]) => ({ name, matches }))
}

// Ek sport ke andar leagues/matches — apna alag component isliye taaki
// events sirf tab fetch hon jab wo sport expand kiya jaaye (lazy), na ki
// saare sports ke liye upfront.
function SidebarSport({ sport, isExpanded, onToggle, expandedItems, onToggleLeague, onVirtualClick }) {
  const { data: events, isFetching } = useGetEventsQuery(sport.etid, { skip: !isExpanded })
  const leagues = useMemo(() => groupEventsBySeries(events), [events])

  return (
    <div className="sidebar-accordion-header">
      <div className="sidebar-submenu-item">
        <a className="sidebar-tree-link" onClick={onToggle}>
          <i className={`far ${isExpanded ? 'fa-minus-square' : 'fa-plus-square'} sidebar-tree-icon`}></i>
          <span>{sport.name}</span>
        </a>
        {isExpanded && isFetching && (
          <div className="sidebar-nested-wrapper"><span className="sidebar-match-item">Loading…</span></div>
        )}
        {isExpanded && !isFetching && leagues.length === 0 && (
          <div className="sidebar-nested-wrapper"><span className="sidebar-match-item">No matches</span></div>
        )}
        {isExpanded && !isFetching && leagues.map((league) => {
          const leagueKey = `${sport.name}_${league.name}`
          const leagueExpanded = expandedItems[leagueKey]
          return (
            <div className="sidebar-submenu-wrapper" key={leagueKey}>
              <div className="sidebar-submenu-item">
                <a className="sidebar-tree-link" onClick={() => onToggleLeague(leagueKey)}>
                  <i className={`far ${leagueExpanded ? 'fa-minus-square' : 'fa-plus-square'} sidebar-tree-icon`}></i>
                  <span>{league.name}</span>
                </a>
                {leagueExpanded && (
                  <div className="sidebar-nested-wrapper">
                    {league.matches.map((match) => (
                      <div className="sidebar-match-item" key={match.gmid}>
                        {match.isVirtual ? (
                          <span className="sidebar-match-link" role="button" onClick={onVirtualClick}>
                            <span>{match.ename}</span>
                          </span>
                        ) : (
                          <Link className="sidebar-match-link" to={`/game-details/${sport.etid}/${match.gmid}`}>
                            <span>{match.ename}</span>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Sidebar({ isOpen, onClose }) {
  const [racingOpen, setRacingOpen] = useState(true)
  const [othersOpen, setOthersOpen] = useState(true)
  const [allSportsOpen, setAllSportsOpen] = useState(true)
  const [expandedItems, setExpandedItems] = useState({})

  const { data: sports } = useGetSportsQuery()

  const toggle = (key) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
      {isOpen && <div className="sidebar-backdrop xl:hidden" onClick={onClose} />}
      <div className={`sidebar-container left-sidebar ${isOpen ? 'is-open' : ''}`}>
        <div>
          {/* Mobile Search Header */}
        <div className="sidebar-mobile-search-header">
          <div className="sidebar-mobile-search-wrapper">
            <input type="search" placeholder="Search here" className="sidebar-mobile-search-input" defaultValue="" />
          </div>
          <div className="sidebar-mobile-close-btn" onClick={onClose}>
            <i className="far fa-times-circle"></i>
          </div>
        </div>

        {/* Racing Sports Accordion */}
        <div className="sidebar-accordion-section">
          <div className="sidebar-accordion-header">
            <h2 className="sidebar-accordion-title">
              <button
                type="button"
                aria-expanded={racingOpen}
                className="sidebar-accordion-btn"
                onClick={() => setRacingOpen(!racingOpen)}
              >
                <span>Racing Sports</span>
                <i className={`fas fa-chevron-${racingOpen ? 'up' : 'down'} sidebar-accordion-icon`}></i>
              </button>
            </h2>
            {racingOpen && (
              <div className="sidebar-accordion-content">
                <ul className="sidebar-menu-list">
                  <li className="sidebar-menu-item">
                    <a className="sidebar-menu-link" href="#">Horse Racing</a>
                  </li>
                  <li className="sidebar-menu-item">
                    <a className="sidebar-menu-link" href="#">Greyhound Racing</a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Others Accordion */}
        <div className="sidebar-accordion-section">
          <div className="sidebar-accordion-header">
            <h2 className="sidebar-accordion-title">
              <button
                type="button"
                aria-expanded={othersOpen}
                className="sidebar-accordion-btn"
                onClick={() => setOthersOpen(!othersOpen)}
              >
                <span>Others</span>
                <i className={`fas fa-chevron-${othersOpen ? 'up' : 'down'} sidebar-accordion-icon`}></i>
              </button>
            </h2>
            {othersOpen && (
              <div className="sidebar-accordion-content">
                <ul className="sidebar-menu-list">
                  <li className="sidebar-menu-item"><Link className="sidebar-menu-link" to="/casino-list/LC/4"><span className="sidebar-blink-text">Our Casino</span></Link></li>
                  <li className="sidebar-menu-item"><Link className="sidebar-menu-link" to="/casino-list/LC/45"><span className="sidebar-blink-text">Our VIP Casino</span></Link></li>
                  <li className="sidebar-menu-item"><Link className="sidebar-menu-link" to="/casino-list/LC/52"><span className="sidebar-blink-text">Our Premium Casino</span></Link></li>
                  <li className="sidebar-menu-item"><Link className="sidebar-menu-link" to="/casino-list/LC/19"><span className="sidebar-blink-text">Our Virtual</span></Link></li>
                  <li className="sidebar-menu-item"><Link className="sidebar-menu-link" to="/live-casino-list/CS/24"><span>Live Casino</span></Link></li>
                  <li className="sidebar-menu-item"><Link className="sidebar-menu-link" to="/slot-list"><span>Slot Game</span></Link></li>
                  <li className="sidebar-menu-item"><Link className="sidebar-menu-link" to="/fantasy-list"><span>Fantasy Game</span></Link></li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* All Sports Accordion */}
        <div className="sidebar-accordion-section">
          <div className="sidebar-accordion-header">
            <h2 className="sidebar-accordion-title">
              <button
                type="button"
                aria-expanded={allSportsOpen}
                className="sidebar-accordion-btn"
                onClick={() => setAllSportsOpen(!allSportsOpen)}
              >
                <span>All Sports</span>
                <i className={`fas fa-chevron-${allSportsOpen ? 'up' : 'down'} sidebar-accordion-icon`}></i>
              </button>
            </h2>
            {allSportsOpen && (
              <div className="sidebar-accordion-content">
                <div>
                  {(sports || []).map((sport) => (
                    <SidebarSport
                      key={sport.etid}
                      sport={sport}
                      isExpanded={Boolean(expandedItems[sport.name])}
                      onToggle={() => toggle(sport.name)}
                      expandedItems={expandedItems}
                      onToggleLeague={toggle}
                      onVirtualClick={() => message.error('Contact to upline')}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
