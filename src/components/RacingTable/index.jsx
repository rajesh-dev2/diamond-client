import { useState } from 'react'
import './style.css'

export default function RacingTable({ racingData }) {
  const defaultCountry = racingData?.countries?.[0] || 'GB'
  const [activeCountry, setActiveCountry] = useState(defaultCountry)

  const currentCountry = racingData?.tracks?.[activeCountry] ? activeCountry : defaultCountry
  const tracks = racingData?.tracks?.[currentCountry] || []

  return (
    <div className="racing-table-container">
      {/* Country Filter Sub-tabs */}
      <div className="country-tabs">
        {racingData?.countries?.map((country) => (
          <button
            key={country}
            type="button"
            className={`country-tab ${currentCountry === country ? 'active' : ''}`}
            onClick={() => setActiveCountry(country)}
          >
            {country}
          </button>
        ))}
      </div>

      {/* Track Rows */}
      <div className="racing-table">
        {tracks.map((track, idx) => (
          <div className="track-row" key={idx}>
            <div className="track-name-col">
              {track.hasTv && <i className="fas fa-tv icon-tv me-1.5"></i>}
              <span className="track-name">{track.name}</span>
            </div>

            <div className="track-times-col">
              {track.times.map((time, tIdx) => (
                <div className={`time-pill ${tIdx === 0 ? 'has-corner' : ''}`} key={tIdx}>
                  <span>{time}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
