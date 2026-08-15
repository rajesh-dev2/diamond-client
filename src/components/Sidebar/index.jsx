import { useState } from 'react'
import { Link } from 'react-router-dom'
import './style.css'

export default function Sidebar({ isOpen, onClose }) {
  const [racingOpen, setRacingOpen] = useState(true)
  const [othersOpen, setOthersOpen] = useState(true)
  const [allSportsOpen, setAllSportsOpen] = useState(true)
  const [expandedItems, setExpandedItems] = useState({})

  const toggle = (key) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const allSports = [
    { 
      name: 'Politics', 
      leagues: [
        { 
          name: 'Assembly Election 2026', 
          matches: [
            { name: 'Assembly Election 2026', link: '/game-details/40/891072363' }
          ] 
        }
      ]
    },
    { 
      name: 'Cricket', 
      leagues: [
        { name: 'T5 XI', matches: [{ name: 'GAW XI v TKR XI', link: '/cricketv/4/56194484' }] },
        { 
          name: 'Dim Cricket League (1 over)', 
          matches: [
            { name: 'Gujarat Titans (e) - Chennai Super Kings (e)', link: '/tp-virtual-cricket/4/687567021' },
            { name: 'Gujarat Titans (e) - Rajasthan Royals (e)', link: '/tp-virtual-cricket/4/668697867' },
            { name: 'Kolkata Knight Riders (e) - Chennai Super Kings (e)', link: '/tp-virtual-cricket/4/497141437' },
            { name: 'Kolkata Knight Riders (e) - Punjab Kings (e)', link: '/tp-virtual-cricket/4/466588064' },
            { name: 'Mumbai Indians (e) - Gujarat Titans (e)', link: '/tp-virtual-cricket/4/664546231' },
            { name: 'Mumbai Indians (e) - Rajasthan Royals (e)', link: '/tp-virtual-cricket/4/820928502' },
            { name: 'Punjab Kings (e) - Chennai Super Kings (e)', link: '/tp-virtual-cricket/4/602841925' },
            { name: 'Royal Challengers Bengaluru (e) - Delhi Capitals (e)', link: '/tp-virtual-cricket/4/596152748' },
            { name: 'Sunrisers Hyderabad (e) - Chennai Super Kings (e)', link: '/tp-virtual-cricket/4/898481288' }
          ] 
        },
        { 
          name: 'The Hundred', 
          matches: [
            { name: 'Birmingham Phoenix v MI London', link: '/game-details/4/758835975' },
            { name: 'Manchester Super Giants v Sunrisers Leeds', link: '/game-details/4/645415123' },
            { name: 'Welsh Fire v London Spirit', link: '/game-details/4/527541367' }
          ] 
        },
        { 
          name: 'Virtual Cricket League', 
          matches: [
            { name: 'Brisbane Heat T10 v Adelaide Strikers T10', link: '/virtual-cricket/4/571871373' },
            { name: 'Kolkata Knight Riders T10 v Sunrisers T10', link: '/virtual-cricket/4/512680651' },
            { name: 'New Zealand T10 v Pakistan T10', link: '/virtual-cricket/4/629388092' }
          ] 
        },
        { 
          name: 'Metro Bank One Day Cup', 
          matches: [
            { name: 'Essex v Yorkshire', link: '/game-details/4/658074878' },
            { name: 'Hampshire v Derbyshire', link: '/game-details/4/673227137' },
            { name: 'Middlesex v Sussex', link: '/game-details/4/474277949' },
            { name: 'Somerset v Lancashire', link: '/game-details/4/602146103' },
            { name: 'Surrey v Nottinghamshire', link: '/game-details/4/599321415' },
            { name: 'Warwickshire v Kent', link: '/game-details/4/712183119' },
            { name: 'Worcestershire v Durham', link: '/game-details/4/748317923' }
          ] 
        },
        { 
          name: 'Tamil Nadu Premier League', 
          matches: [
            { name: 'Lyca Kovai Kings v Tiruppur Tamizhans', link: '/game-details/4/800455799' },
            { name: 'Nellai Royal Kings v Ruby Trichy Warriors', link: '/game-details/4/662408682' }
          ] 
        },
        { name: 'Test Matches', matches: [{ name: 'Australia v Bangladesh', link: '/game-details/4/789035493' }] },
        { name: 'T10 XI', matches: [{ name: 'Sydney Sixers XI v Sydney Thunder XI', link: '/cricketv/4/49755851' }] },
        { 
          name: 'The Hundred - Womens', 
          matches: [
            { name: 'Birmingham Phoenix W v MI London W', link: '/game-details/4/890840157' },
            { name: 'Manchester Super Giants W v Sunrisers Leeds W', link: '/game-details/4/571020064' }
          ] 
        },
        { 
          name: 'Delhi Premier League 2026', 
          matches: [
            { name: 'Central Delhi Kings v New Delhi Tigers', link: '/game-details/4/914853906' },
            { name: 'West Delhi Lions v North Delhi Strikers', link: '/game-details/4/486703391' }
          ] 
        },
        { 
          name: 'Caribbean Premier League', 
          matches: [
            { name: 'Jamaica Kingsmen v Barbados Tridents', link: '/game-details/4/650756963' },
            { name: 'St. Lucia Kings v St. Kitts and Nevis Patriots', link: '/game-details/4/723022331' }
          ] 
        },
        { name: 'National Champions Cup 2026/27', matches: [{ name: 'Pakistan Greens v Pakistan Whites', link: '/game-details/4/690443000' }] },
        { name: 'One Day Internationals', matches: [{ name: 'Ireland v Afghanistan', link: '/game-details/4/483208524' }] }
      ]
    },
    { 
      name: 'Football', 
      leagues: [
        { 
          name: 'EUROPE Champions League - Qualification', 
          matches: [
            { name: 'Bodo Glimt v Union St Gilloise', link: '/game-details/1/590253757' },
            { name: 'Crvena Zvezda v Hapoel Beer Sheva', link: '/game-details/1/823971786' },
            { name: 'Lyon v Sparta Prague', link: '/game-details/1/532962206' },
            { name: 'Sturm Graz v Fenerbahce', link: '/game-details/1/744139052' }
          ] 
        },
        { 
          name: 'SCOTLAND Challenge Cup', 
          matches: [
            { name: 'Alloa v Stranraer', link: '/game-details/1/643229873' },
            { name: 'Dumbarton v Airdrieonians', link: '/game-details/1/811498290' }
          ] 
        },
        { 
          name: 'SOUTH AMERICA COPA SUDAMERICANA', 
          matches: [
            { name: 'Boca Juniors v Deportivo Recoleta', link: '/game-details/1/490536117' },
            { name: 'Bolivar v Sao Paulo', link: '/game-details/1/594113578' }
          ] 
        },
        { 
          name: 'SPAIN LaLiga', 
          matches: [
            { name: 'Alaves v Getafe', link: '/game-details/1/771950885' },
            { name: 'Celta Vigo v Osasuna', link: '/game-details/1/918382682' },
            { name: 'Sevilla v Rayo Vallecano', link: '/game-details/1/782504529' }
          ] 
        },
        { 
          name: 'WORLD Club Friendly', 
          matches: [
            { name: 'Arsenal v Como', link: '/game-details/1/534505605' },
            { name: 'Man Utd v Leeds', link: '/game-details/1/910421715' },
            { name: 'Newcastle v Everton', link: '/game-details/1/784535368' }
          ] 
        }
      ]
    },
    { 
      name: 'Tennis', 
      leagues: [
        { 
          name: 'ATP - SINGLES Cincinnati (USA)', 
          matches: [
            { name: 'Alek Shevchenko v Llamas Ruiz', link: '/game-details/2/831871291' },
            { name: 'Nishikori v Comesana', link: '/game-details/2/523850983' }
          ] 
        },
        { 
          name: 'CHALLENGER MEN - SINGLES BROWNSBURG (USA)', 
          matches: [
            { name: 'An Ilagan v Andres Martin', link: '/game-details/2/886999349' },
            { name: 'Tomic v E Winter', link: '/game-details/2/652388918' }
          ] 
        }
      ]
    },
    { name: 'Table Tennis', leagues: [] },
    { name: 'Badminton', leagues: [] },
    { name: 'Esoccer', leagues: [] },
    { name: 'Basketball', leagues: [] },
    { name: 'Volleyball', leagues: [] },
    { name: 'Snooker', leagues: [] },
    { name: 'Ice Hockey', leagues: [] },
    { name: 'E Games', leagues: [] },
    { name: 'Futsal', leagues: [] },
    { name: 'Handball', leagues: [] },
    { name: 'Kabaddi', leagues: [] },
    { name: 'Golf', leagues: [] },
    { name: 'Rugby League', leagues: [] },
    { name: 'Boxing', leagues: [] },
    { name: 'Beach Volleyball', leagues: [] },
    { name: 'Mixed Martial Arts', leagues: [] },
    { name: 'MotoGP', leagues: [] },
    { name: 'Chess', leagues: [] },
    { name: 'Cycling', leagues: [] },
    { name: 'Motorbikes', leagues: [] },
    { name: 'Athletics', leagues: [] },
    { name: 'Basketball 3X3', leagues: [] },
    { name: 'Sumo', leagues: [] },
    { name: 'Virtual sports', leagues: [] }
  ]

  const renderSubMenu = (leagues, parentKey) => {
    return leagues.map((league) => {
      const leagueKey = `${parentKey}_${league.name}`
      const isExpanded = expandedItems[leagueKey]
      return (
        <div className="sidebar-submenu-wrapper" key={leagueKey}>
          <div className="sidebar-submenu-item">
            <a 
              className="sidebar-tree-link" 
              onClick={() => toggle(leagueKey)}
            >
              <i className={`far ${isExpanded ? 'fa-minus-square' : 'fa-plus-square'} sidebar-tree-icon`}></i>
              <span>{league.name}</span>
            </a>
            {isExpanded && league.matches && league.matches.length > 0 && (
              <div className="sidebar-nested-wrapper">
                {league.matches.map((match, mIdx) => (
                  <div className="sidebar-match-item" key={mIdx}>
                    <Link 
                      className="sidebar-match-link" 
                      to={match.link || '/home'}
                    >
                      <span>{match.name || match}</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )
    })
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
                  {allSports.map((sport) => {
                    const sportKey = sport.name
                    const isExpanded = expandedItems[sportKey]
                    const hasLeagues = sport.leagues && sport.leagues.length > 0
                    return (
                      <div className="sidebar-accordion-header" key={sportKey}>
                        <div className="sidebar-submenu-item">
                          <a 
                            className="sidebar-tree-link" 
                            onClick={() => toggle(sportKey)}
                          >
                            <i className={`far ${isExpanded ? 'fa-minus-square' : 'fa-plus-square'} sidebar-tree-icon`}></i>
                            <span>{sport.name}</span>
                          </a>
                          {isExpanded && hasLeagues && (
                            renderSubMenu(sport.leagues, sportKey)
                          )}
                        </div>
                      </div>
                    )
                  })}
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
