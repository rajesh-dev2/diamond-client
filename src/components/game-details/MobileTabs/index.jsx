import './style.css'

const TABS = [
  { key: 'odds', label: 'Odds' },
  { key: 'matchedBet', label: null },
  { key: 'tv', label: null, icon: 'fas fa-tv' },
]

export default function MobileTabs({ activeTab, onTabChange, betCount = 0 }) {
  return (
    <ul className="gdv2-mobile-tabs">
      {TABS.map((tab) => (
        <li key={tab.key} className="gdv2-tab-item">
          <button
            type="button"
            className={`gdv2-tab-link${activeTab === tab.key ? ' gdv2-tab-active' : ''}`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.icon
              ? <i className={tab.icon} />
              : tab.key === 'matchedBet'
                ? `Matched Bet (${betCount})`
                : tab.label
            }
          </button>
        </li>
      ))}
    </ul>
  )
}
