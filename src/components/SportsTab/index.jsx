import './style.css'

export const defaultTabs = [
  { name: 'Cricket', iconClass: 'icon-4', faIcon: 'fa-baseball-ball' },
  { name: 'Football', iconClass: 'icon-1', faIcon: 'fa-futbol' },
  { name: 'Tennis', iconClass: 'icon-2', faIcon: 'fa-table-tennis-paddle-ball' },
  { name: 'Table Tennis', iconClass: 'icon-8', faIcon: 'fa-table-tennis-paddle-ball' },
  { name: 'Horse Racing', iconClass: 'icon-10', faIcon: 'fa-horse' },
  { name: 'Greyhound Racing', iconClass: 'icon-65', faIcon: 'fa-dog' },
  { name: 'Basketball', iconClass: 'icon-15', faIcon: 'fa-basketball-ball' },
  { name: 'Esoccer', iconClass: 'icon-68', faIcon: 'fa-gamepad' },
  { name: 'Wrestling', iconClass: 'icon-69', faIcon: 'fa-hand-fist' },
  { name: 'Volleyball', iconClass: 'icon-18', faIcon: 'fa-volleyball-ball' },
  { name: 'Badminton', iconClass: 'icon-22', faIcon: 'fa-trophy' },
  { name: 'Snooker', iconClass: 'icon-59', faIcon: 'fa-circle' },
  { name: 'Darts', iconClass: 'icon-57', faIcon: 'fa-bullseye' },
  { name: 'Boxing', iconClass: 'icon-6', faIcon: 'fa-hand-fist' },
  { name: 'Mixed Martial Arts', iconClass: 'icon-3', faIcon: 'fa-user-ninja' },
  { name: 'American Football', iconClass: 'icon-58', faIcon: 'fa-football-ball' },
  { name: 'E Games', iconClass: 'icon-11', faIcon: 'fa-gamepad' },
  { name: 'Ice Hockey', iconClass: 'icon-19', faIcon: 'fa-hockey-puck' },
  { name: 'Futsal', iconClass: 'icon-9', faIcon: 'fa-futbol' },
  { name: 'Motor Sports', iconClass: 'icon-52', faIcon: 'fa-car' },
  { name: 'Politics', iconClass: 'icon-40', faIcon: 'fa-landmark' },
  { name: 'Kabaddi', iconClass: 'icon-66', faIcon: 'fa-people-group' }
]

const iconByName = defaultTabs.reduce((acc, tab) => {
  acc[tab.name] = { iconClass: tab.iconClass, faIcon: tab.faIcon }
  return acc
}, {})

export function mapSportsToTabs(sports = []) {
  return sports
    .map((sport) => {
      const name = typeof sport === 'string' ? sport : sport.name
      const icon = iconByName[name]
      return {
        name,
        iconClass: icon?.iconClass || 'icon-1',
        faIcon: icon?.faIcon || 'fa-circle',
      }
    })
    .sort((a, b) => (a.name === 'Cricket' ? -1 : b.name === 'Cricket' ? 1 : 0))
}

export default function SportsTab({ tabs = defaultTabs, activeTab, onTabChange }) {
  const handleTabClick = (e, tabName) => {
    e.currentTarget.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    })
    if (onTabChange) {
      onTabChange(tabName)
    }
  }

  return (
    <ul className="nav nav-pills sports-tab">
      {tabs.map((tab) => (
        <li className="nav-item" key={tab.name}>
          <a 
            className={`nav-link ${activeTab === tab.name ? 'active' : ''}`}
            onClick={(e) => handleTabClick(e, tab.name)}
          >
            <div className="d-xl-none">
              <i className={`icon ${tab.iconClass} ${tab.faIcon ? `fas ${tab.faIcon}` : ''}`}></i>
            </div>
            <span>{tab.name}</span>
          </a>
        </li>
      ))}

    </ul>
  )
}
