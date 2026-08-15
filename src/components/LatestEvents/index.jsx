import { Link } from 'react-router-dom'
import './style.css'

const defaultEvents = [
  { title: 'Nellai Royal Kings v Ruby Trichy Warriors', link: '/game-details/4/662408682', iconClass: 'icon-4', faIcon: 'fa-baseball-ball' },
  { title: 'Manchester Super Giants W v Sunrisers Leeds W', link: '/game-details/4/571020064', iconClass: 'icon-4', faIcon: 'fa-baseball-ball' },
  { title: 'Denis Hofman - Jakub Tazler', link: '/game-details/8/885325764', iconClass: 'icon-8', faIcon: 'fa-table-tennis' },
  { title: 'Matyas Navedla - Tadeas Zika', link: '/game-details/8/727482162', iconClass: 'icon-8', faIcon: 'fa-table-tennis' },
  { title: 'Joonghoon Lim - Peng Xiang', link: '/game-details/8/818484963', iconClass: 'icon-8', faIcon: 'fa-table-tennis' }
]

export default function LatestEvents({ events = defaultEvents }) {
  return (
    <div className="latest-event d-xl-flex">
      {events.map((evt, idx) => (
        <div className="latest-event-item" key={idx}>
          <Link className="blink_me" to={evt.link}>
            <i className={`d-icon me-1 ${evt.iconClass} fas ${evt.faIcon}`}></i>
            <span>{evt.title}</span>
          </Link>
        </div>
      ))}
    </div>
  )
}
