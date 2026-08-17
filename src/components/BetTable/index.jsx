import { Link } from 'react-router-dom'
import './style.css'

export default function BetTable({ matches = [] }) {
  if (matches.length === 0) {
    return (
      <div className="bet-table">
        <div className="bet-table-empty">
          <svg viewBox="0 0 120 120" className="bet-table-empty-icon" aria-hidden="true">
            <circle cx="60" cy="60" r="56" fill="#eef1f3" />
            <rect x="30" y="42" width="60" height="42" rx="4" fill="#fff" stroke="#c7c8ca" strokeWidth="2" />
            <rect x="30" y="42" width="60" height="12" rx="4" fill="#c7c8ca" />
            <circle cx="60" cy="70" r="12" fill="#fff" stroke="#9aa1a7" strokeWidth="2" />
            <path d="M55 70h10M60 65v10" stroke="#9aa1a7" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div className="bet-table-empty-title">No Matches Available</div>
          <div className="bet-table-empty-subtitle">Please check back later</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bet-table">
      <div className="bet-table-header">
        <div className="bet-nation-name"><b>Game</b></div>
        <div className="bet-nation-odd"><b>1</b></div>
        <div className="bet-nation-odd"><b>X</b></div>
        <div className="bet-nation-odd"><b>2</b></div>
      </div>

      <div className="bet-table-body">
        {matches.map((row) => {
          const isAllSuspended = row.suspended1 && row.suspendedX && row.suspended2

          return (
            <div className="bet-table-row" key={row.id}>
              <div className="bet-nation-name">
                <Link className="bet-nation-game-name" to={row.link || '#'}>
                  <span>{row.title}</span>
                  {row.date && (
                    <>
                      <span className="d-none d-md-inline-block">&nbsp;/&nbsp;</span>
                      <span>{row.date}</span>
                    </>
                  )}
                </Link>

                <div className="game-icons">
                  <div className="game-icon">
                    {row.live && <span className="active"></span>}
                  </div>
                  <div className="game-icon">
                    {row.icons?.includes('tv') && <i className="fas fa-tv icon-tv"></i>}
                  </div>
                  <div className="game-icon">
                    {row.icons?.includes('f') && <span className="badge-f">f</span>}
                  </div>
                  <div className="game-icon">
                    {row.icons?.includes('BM') && <span className="badge-bm">BM</span>}
                  </div>
                  <div className="game-icon">
                    {row.icons?.includes('e') && (
                      <div className="game-icon e-games">
                        <span>e</span>
                      </div>
                    )}
                    {row.icons?.includes('gamepad') && (
                      <i className="fas fa-gamepad icon-gamepad"></i>
                    )}
                    {row.icons?.includes('pins') && (
                      <i className="fas fa-thumbtack icon-pins text-slate-500"></i>
                    )}
                  </div>
                </div>
              </div>

              <div className="bet-nation-odd md:hidden"><b>1</b></div>
              <div className="bet-nation-odd md:hidden"><b>X</b></div>
              <div className="bet-nation-odd md:hidden"><b>2</b></div>

              {isAllSuspended ? (
                <>
                  <div className="bet-nation-odd suspended-box" data-title={row.status1 || 'SUSPENDED'}>
                    <div className="back odd-box">
                      <span className="bet-odd"><b>{row.back1 || '-'}</b></span>
                    </div>
                    <div className="lay odd-box">
                      <span className="bet-odd"><b>{row.lay1 || '-'}</b></span>
                    </div>
                  </div>
                  <div className="bet-nation-odd suspended-box" data-title={row.statusX || 'SUSPENDED'}>
                    <div className="back odd-box">
                      <span className="bet-odd"><b>{row.backX || '-'}</b></span>
                    </div>
                    <div className="lay odd-box">
                      <span className="bet-odd"><b>{row.layX || '-'}</b></span>
                    </div>
                  </div>
                  <div className="bet-nation-odd suspended-box" data-title={row.status2 || 'SUSPENDED'}>
                    <div className="back odd-box">
                      <span className="bet-odd"><b>{row.back2 || '-'}</b></span>
                    </div>
                    <div className="lay odd-box">
                      <span className="bet-odd"><b>{row.lay2 || '-'}</b></span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Column 1 */}
                  {row.suspended1 ? (
                    <div className="bet-nation-odd suspended-box" data-title={row.status1 || 'SUSPENDED'}>
                      <div className="back odd-box">
                        <span className="bet-odd"><b>{row.back1 || '-'}</b></span>
                      </div>
                      <div className="lay odd-box">
                        <span className="bet-odd"><b>{row.lay1 || '-'}</b></span>
                      </div>
                    </div>
                  ) : (
                    <div className="bet-nation-odd">
                      <div className="back odd-box">
                        <span className="bet-odd"><b>{row.back1 || '-'}</b></span>
                      </div>
                      {row.lay1Locked ? (
                        <div className="lay odd-box locked-box">
                          <span className="bet-odd"><b>{row.lay1Locked === true ? '' : row.lay1Locked}</b></span>
                        </div>
                      ) : (
                        <div className="lay odd-box">
                          <span className="bet-odd"><b>{row.lay1 || '-'}</b></span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Column X */}
                  {row.suspendedX ? (
                    <div className="bet-nation-odd suspended-box" data-title={row.statusX || 'SUSPENDED'}>
                      <div className="back odd-box">
                        <span className="bet-odd"><b>{row.backX || '-'}</b></span>
                      </div>
                      <div className="lay odd-box">
                        <span className="bet-odd"><b>{row.layX || '-'}</b></span>
                      </div>
                    </div>
                  ) : (
                    <div className="bet-nation-odd">
                      <div className="back odd-box">
                        <span className="bet-odd"><b>{row.backX || '-'}</b></span>
                      </div>
                      <div className="lay odd-box">
                        <span className="bet-odd"><b>{row.layX || '-'}</b></span>
                      </div>
                    </div>
                  )}

                  {/* Column 2 */}
                  {row.suspended2 ? (
                    <div className="bet-nation-odd suspended-box" data-title={row.status2 || 'SUSPENDED'}>
                      <div className="back odd-box">
                        <span className="bet-odd"><b>{row.back2 || '-'}</b></span>
                      </div>
                      <div className="lay odd-box">
                        <span className="bet-odd"><b>{row.lay2 || '-'}</b></span>
                      </div>
                    </div>
                  ) : (
                    <div className="bet-nation-odd">
                      <div className="back odd-box">
                        <span className="bet-odd"><b>{row.back2 || '-'}</b></span>
                      </div>
                      {row.lay2Locked ? (
                        <div className="lay odd-box locked-box">
                          <span className="bet-odd"><b>{row.lay2Locked === true ? '' : row.lay2Locked}</b></span>
                        </div>
                      ) : (
                        <div className="lay odd-box">
                          <span className="bet-odd"><b>{row.lay2 || '-'}</b></span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
