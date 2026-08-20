import './style.css'

const DEFAULT_GROUPS = [
  {
    title: 'Player A',
    cards: [
      'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/8C.png',
      'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/6H.png',
      'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/4S.png',
    ],
  },
  {
    title: 'Player B',
    className: 'mt-1',
    cards: [
      'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/3H.png',
      'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/1C.png',
      'https://versionobj.ecoassetsservice.com/v106/static/front/img/cards/7S.png',
    ],
  },
]

/**
 * CasinoVideoCards
 * ────────────────
 * Floating card hand overlay component rendered on top of casino live streams.
 *
 * Renders:
 *   <div className="casino-video-cards">
 *     <div>
 *       <h5>Player A</h5>
 *       <div>
 *         <img src="..." alt="..." />
 *       </div>
 *     </div>
 *     <div className="mt-1">
 *       <h5>Player B</h5>
 *       <div>
 *         <img src="..." alt="..." />
 *       </div>
 *     </div>
 *   </div>
 *
 * @prop {Array}           [groups]    – Array of card groups [{ title, cards, className }]
 * @prop {string}          [className] – Optional extra CSS class for container
 * @prop {React.ReactNode} [children]  – Custom content/children if not using groups prop
 */
export default function CasinoVideoCards({
  groups = DEFAULT_GROUPS,
  className = '',
  children,
}) {
  if (children) {
    return (
      <div className={`casino-video-cards ${className}`.trim()}>
        {children}
      </div>
    )
  }

  return (
    <div className={`casino-video-cards ${className}`.trim()}>
      {groups.map((group, idx) => (
        <div key={group.id || group.title || idx} className={group.className || ''}>
          {group.title && <h5>{group.title}</h5>}
          <div>
            {group.cards &&
              group.cards.map((card, cIdx) => {
                const src = typeof card === 'string' ? card : card?.img || card?.src
                const alt = typeof card === 'string' ? `Card ${cIdx + 1}` : card?.alt || card?.name || `Card ${cIdx + 1}`
                return (
                  <img
                    key={cIdx}
                    src={src}
                    alt={alt}
                  />
                )
              })}
          </div>
        </div>
      ))}
    </div>
  )
}
