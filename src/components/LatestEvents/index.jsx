import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { authApi, useGetSportsQuery } from '../../store/api/authApi'
import { iconByName } from '../SportsTab'
import './style.css'

const REFRESH_MS = 30000
const MAX_EVENTS = 5

function mapEventToItem(event, iconClass) {
  return {
    title: event.ename,
    link: `/game-details/${event.etid}/${event.gmid}`,
    iconClass,
  }
}

export default function LatestEvents() {
  const dispatch = useDispatch()
  const { data: sports } = useGetSportsQuery()
  const [events, setEvents] = useState([])

  useEffect(() => {
    if (!sports?.length) return

    let cancelled = false

    const fetchLiveEvents = async () => {
      const results = await Promise.all(
        sports.map((sport) => {
          const subscription = dispatch(authApi.endpoints.getLiveEvents.initiate(sport.etid))
          return subscription
            .unwrap()
            .then((data) => (data || []).map((event) => mapEventToItem(event, iconByName[sport.name] || 'icon-1')))
            .catch(() => [])
            .finally(() => subscription.unsubscribe())
        })
      )
      if (!cancelled) setEvents(results.flat().slice(0, MAX_EVENTS))
    }

    fetchLiveEvents()
    const interval = setInterval(fetchLiveEvents, REFRESH_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [sports, dispatch])

  if (!events.length) return null

  return (
    <div className="latest-event d-xl-flex">
      {events.map((evt) => (
        <div className="latest-event-item" key={evt.link}>
          <Link className="blink_me" to={evt.link}>
            <i className={`d-icon me-1 icon ${evt.iconClass}`}></i>
            <span>{evt.title}</span>
          </Link>
        </div>
      ))}
    </div>
  )
}
