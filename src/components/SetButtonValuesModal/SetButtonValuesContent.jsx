import React, { useState, useEffect } from 'react'
import { message } from 'antd'
import { useGetButtonSettingsQuery, useUpdateButtonSettingsMutation } from '../../store/api/authApi'
import { DEFAULT_GAME_BUTTONS, DEFAULT_CASINO_BUTTONS } from './defaultButtonValues'

export default function SetButtonValuesContent({ onUpdate }) {
  const [activeTab, setActiveTab] = useState(1) // 1: Game Buttons, 2: Casino Buttons
  const { data: settings } = useGetButtonSettingsQuery()
  const [updateButtonSettings, { isLoading: isSaving }] = useUpdateButtonSettingsMutation()

  const [gameButtons, setGameButtons] = useState(DEFAULT_GAME_BUTTONS)
  const [casinoButtons, setCasinoButtons] = useState(DEFAULT_CASINO_BUTTONS)

  useEffect(() => {
    if (settings?.gameButtons?.length) setGameButtons(settings.gameButtons)
    if (settings?.casinoButtons?.length) setCasinoButtons(settings.casinoButtons)
  }, [settings])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateButtonSettings({
        gameButtons: gameButtons.map((btn) => ({ label: btn.label, value: Number(btn.value) })),
        casinoButtons: casinoButtons.map((btn) => ({ label: btn.label, value: Number(btn.value) })),
      }).unwrap()
      message.success('Button values updated')
      if (onUpdate) onUpdate()
    } catch (err) {
      message.error(err?.data?.message || 'Failed to update button values')
    }
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
                <div className="row row10" key={idx}>
                  <div className="mb-3 col-6 position-relative">
                    <input
                      name={`buttons[${idx}].label`}
                      type="text"
                      className="form-control"
                      value={btn.label}
                      onChange={(e) => handleGameChange(idx, 'label', e.target.value)}
                    />
                  </div>
                  <div className="mb-3 col-6 position-relative">
                    <input
                      name={`buttons[${idx}].value`}
                      type="text"
                      className="form-control"
                      value={btn.value}
                      onChange={(e) => handleGameChange(idx, 'value', e.target.value)}
                    />
                  </div>
                </div>
              ))}

              <div className="row row10">
                <div className="mb-3 col-md-6 col-12">
                  <button type="submit" className="btn btn-primary btn-block w-100" disabled={isSaving}>
                    {isSaving ? 'Updating…' : 'Update'}
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
                <div className="row row10" key={idx}>
                  <div className="mb-3 col-6 position-relative">
                    <input
                      name={`buttons[${idx}].label`}
                      type="text"
                      className="form-control"
                      value={btn.label}
                      onChange={(e) => handleCasinoChange(idx, 'label', e.target.value)}
                    />
                  </div>
                  <div className="mb-3 col-6 position-relative">
                    <input
                      name={`buttons[${idx}].value`}
                      type="text"
                      className="form-control"
                      value={btn.value}
                      onChange={(e) => handleCasinoChange(idx, 'value', e.target.value)}
                    />
                  </div>
                </div>
              ))}

              <div className="row row10">
                <div className="mb-3 col-md-6 col-12">
                  <button type="submit" className="btn btn-primary btn-block w-100" disabled={isSaving}>
                    {isSaving ? 'Updating…' : 'Update'}
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
