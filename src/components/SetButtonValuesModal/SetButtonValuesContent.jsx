import React, { useState } from 'react'

const initialGameButtons = [
  { btxt: '1k', bval: '1000', bid: '127068869' },
  { btxt: '2k', bval: '2000', bid: '127068870' },
  { btxt: '5k', bval: '5000', bid: '127068871' },
  { btxt: '10k', bval: '10000', bid: '127068872' },
  { btxt: '20k', bval: '20000', bid: '127068873' },
  { btxt: '25k', bval: '25000', bid: '127068874' },
  { btxt: '50k', bval: '50000', bid: '127068875' },
  { btxt: '75k', bval: '75000', bid: '127068876' }
]

const initialCasinoButtons = [
  { btxt: '25', bval: '25', bid: '94784767' },
  { btxt: '50', bval: '50', bid: '94784768' },
  { btxt: '100', bval: '100', bid: '94784769' },
  { btxt: '200', bval: '200', bid: '94784770' },
  { btxt: '500', bval: '500', bid: '94784771' },
  { btxt: '1000', bval: '1000', bid: '94784772' }
]

export default function SetButtonValuesContent({ onUpdate }) {
  const [activeTab, setActiveTab] = useState(1) // 1: Game Buttons, 2: Casino Buttons
  const [gameButtons, setGameButtons] = useState(initialGameButtons)
  const [casinoButtons, setCasinoButtons] = useState(initialCasinoButtons)

  const handleGameChange = (index, field, value) => {
    const updated = [...gameButtons]
    updated[index] = { ...updated[index], [field]: value }
    setGameButtons(updated)
  }

  const handleCasinoChange = (index, field, value) => {
    const updated = [...casinoButtons]
    updated[index] = { ...updated[index], [field]: value }
    setCasinoButtons(updated)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onUpdate) onUpdate({ gameButtons, casinoButtons })
  }

  return (
    <div className="set-button-values-content">
      {/* Navigation Tabs */}
      <div className="mt-1 nav nav-pills" role="tablist">
        <div className="nav-item">
          <a
            role="tab"
            data-rr-ui-event-key="1"
            id="rules-tabs-tab-1"
            aria-controls="rules-tabs-tabpane-1"
            aria-selected={activeTab === 1}
            className={`nav-link ${activeTab === 1 ? 'active' : ''}`}
            tabIndex={activeTab === 1 ? 0 : -1}
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setActiveTab(1)
            }}
          >
            Game Buttons
          </a>
        </div>
        <div className="nav-item">
          <a
            role="tab"
            data-rr-ui-event-key="2"
            id="rules-tabs-tab-2"
            aria-controls="rules-tabs-tabpane-2"
            aria-selected={activeTab === 2}
            className={`nav-link ${activeTab === 2 ? 'active' : ''}`}
            tabIndex={activeTab === 2 ? 0 : -1}
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setActiveTab(2)
            }}
          >
            Casino Buttons
          </a>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-1 tab-content">
        {activeTab === 1 && (
          <div
            role="tabpanel"
            id="rules-tabs-tabpane-1"
            aria-labelledby="rules-tabs-tab-1"
            className="fade tab-pane active show"
          >
            <form onSubmit={handleSubmit}>
              <div className="row row10">
                <div className="col-6">
                  <label className="form-label">
                    <b>Price Label:</b>
                  </label>
                </div>
                <div className="col-6">
                  <label className="form-label">
                    <b>Price Value:</b>
                  </label>
                </div>
              </div>

              {gameButtons.map((btn, idx) => (
                <div className="row row10" key={btn.bid || idx}>
                  <div className="mb-3 col-6 position-relative">
                    <input
                      name={`buttons[${idx}].btxt`}
                      type="text"
                      className="form-control"
                      value={btn.btxt}
                      onChange={(e) => handleGameChange(idx, 'btxt', e.target.value)}
                    />
                  </div>
                  <div className="mb-3 col-6 position-relative">
                    <input
                      name={`buttons[${idx}].bval`}
                      type="text"
                      className="form-control"
                      value={btn.bval}
                      onChange={(e) => handleGameChange(idx, 'bval', e.target.value)}
                    />
                  </div>
                  <input
                    name={`buttons[${idx}].bid`}
                    type="hidden"
                    className="form-control"
                    value={btn.bid}
                  />
                </div>
              ))}

              <div className="row row10">
                <div className="mb-3 col-md-6 col-12">
                  <button type="submit" className="btn btn-primary btn-block w-100">
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {activeTab === 2 && (
          <div
            role="tabpanel"
            id="rules-tabs-tabpane-2"
            aria-labelledby="rules-tabs-tab-2"
            className="fade tab-pane active show"
          >
            <form onSubmit={handleSubmit}>
              <div className="row row10">
                <div className="mb-1 col-6">
                  <label className="form-label">
                    <b>Price Label:</b>
                  </label>
                </div>
                <div className="mb-1 col-6">
                  <label className="form-label">
                    <b>Price Value:</b>
                  </label>
                </div>
              </div>

              {casinoButtons.map((btn, idx) => (
                <div className="row row10" key={btn.bid || idx}>
                  <div className="mb-3 col-6 position-relative">
                    <input
                      name={`buttons[${idx}].btxt`}
                      type="text"
                      className="form-control"
                      value={btn.btxt}
                      onChange={(e) => handleCasinoChange(idx, 'btxt', e.target.value)}
                    />
                  </div>
                  <div className="mb-3 col-6 position-relative">
                    <input
                      name={`buttons[${idx}].bval`}
                      type="text"
                      className="form-control"
                      value={btn.bval}
                      onChange={(e) => handleCasinoChange(idx, 'bval', e.target.value)}
                    />
                  </div>
                  <input
                    name={`buttons[${idx}].bid`}
                    type="hidden"
                    className="form-control"
                    value={btn.bid}
                  />
                </div>
              ))}

              <div className="row row10">
                <div className="mb-3 col-md-6 col-12">
                  <button type="submit" className="btn btn-primary btn-block w-100">
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
