import './style.css'

export const defaultTabs = [
  { name: 'Cricket', iconClass: 'icon-4' },
  { name: 'Football', iconClass: 'icon-1' },
  { name: 'Tennis', iconClass: 'icon-2' },
  { name: 'Table Tennis', iconClass: 'icon-8' },
  { name: 'Horse Racing', iconClass: 'icon-10' },
  { name: 'Greyhound Racing', iconClass: 'icon-65' },
  { name: 'Basketball', iconClass: 'icon-15' },
  { name: 'Wrestling', iconClass: 'icon-69' },
  { name: 'Volleyball', iconClass: 'icon-18' },
  { name: 'Badminton', iconClass: 'icon-22' },
  { name: 'Snooker', iconClass: 'icon-59' },
  { name: 'Boxing', iconClass: 'icon-6' },
  { name: 'Mixed Martial Arts', iconClass: 'icon-3' },
  { name: 'American Football', iconClass: 'icon-58' },
  { name: 'E Games', iconClass: 'icon-11' },
  { name: 'Ice Hockey', iconClass: 'icon-19' },
  { name: 'Futsal', iconClass: 'icon-9' },
  { name: 'Motor Sports', iconClass: 'icon-52' },
  { name: 'Kabaddi', iconClass: 'icon-66' },
  { name: 'Politics', iconClass: 'icon-40' },
  { name: 'Darts', iconClass: 'icon-57' },
  { name: 'Esoccer', iconClass: 'icon-68' },
  { name: 'Boat Racing', iconClass: 'icon-67' },
]

export const iconByName = defaultTabs.reduce((acc, tab) => {
  acc[tab.name] = tab.iconClass
  return acc
}, {})

export function mapSportsToTabs(sports = []) {
  return sports
    .map((sport) => {
      const name = typeof sport === 'string' ? sport : sport.name
      return {
        name,
        iconClass: iconByName[name] || 'icon-1',
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
              <i className={`icon ${tab.iconClass}`}></i>
            </div>
            <span>{tab.name}</span>
          </a>
        </li>
      ))}

    </ul>
  )
}
