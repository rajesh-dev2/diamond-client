import './style.css'

const DEFAULT_TABS = [
  { key: 'odds', label: 'Odds' },
  { key: 'matchedBet', label: null },
  { key: 'tv', label: null, icon: 'fas fa-tv' },
]

export default function MobileTabs({
  activeTab,
  onTabChange,
  betCount = 0,
  tabs = DEFAULT_TABS,
}) {
  return (
    <ul className="gdv2-mobile-tabs">
      {tabs.map((tab) => {
        let label = tab.label
        if (!label && (tab.key === 'matchedBet' || tab.key === 'bets')) {
          label = `Matched Bet (${betCount})`
        }

        return (
          <li key={tab.key} className="gdv2-tab-item">
            <button
              type="button"
              className={`gdv2-tab-link${activeTab === tab.key ? ' gdv2-tab-active' : ''}`}
              onClick={() => onTabChange(tab.key)}
            >
              {tab.icon ? <i className={tab.icon} /> : label || tab.key}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

