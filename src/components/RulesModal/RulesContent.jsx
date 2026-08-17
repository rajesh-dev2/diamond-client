import React, { useState, useMemo } from 'react'
import rulesData from './rulesData'
import './style.css'

export default function RulesContent() {
  const [activeTab, setActiveTab] = useState('0')

  const activeSport = useMemo(() => {
    return rulesData.find(sport => sport.id === activeTab) || rulesData[0]
  }, [activeTab])

  return (
    <>
      {/* Left Sidebar */}
      <div className="rules-left-sidebar">
        <div className="nav nav-pills" role="tablist">
          {rulesData.map((sport) => {
            const isActive = activeTab === sport.id
            return (
              <div className="nav-item" key={sport.id}>
                <a
                  role="tab"
                  data-rr-ui-event-key={sport.id}
                  id={`tules-tabs-tab-${sport.id}`}
                  aria-controls={`tules-tabs-tabpane-${sport.id}`}
                  aria-selected={isActive}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  tabIndex={isActive ? 0 : -1}
                  href={`#sport-${sport.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveTab(sport.id)
                  }}
                >
                  {sport.name}
                </a>
              </div>
            )
          })}
        </div>
      </div>


      {/* Rules Content */}
      <div className="rules-content">
        <div className="tab-content">
          <div
            role="tabpanel"
            id={`tules-tabs-tabpane-${activeSport.id}`}
            aria-labelledby={`tules-tabs-tab-${activeSport.id}`}
            className="fade tab-pane active show"
          >
            {activeSport.sections && activeSport.sections.length > 0 ? (
              activeSport.sections.map((section, sIdx) => (
                <div key={sIdx} className="rules-section-block">
                  <div className="rules-content-title">{section.title}</div>
                  <div className="rules-content-desc">
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <tbody>
                          {section.rows && section.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              <td>
                                <span
                                  className={row.isDanger ? 'text-danger' : ''}
                                  style={{ whiteSpace: 'pre-line' }}
                                >
                                  {row.text}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted">
                No specific rules available for {activeSport.name}.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

