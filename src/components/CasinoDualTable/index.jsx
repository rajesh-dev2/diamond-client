/**
 * CasinoDualTable
 * ───────────────
 * Shared dual-box betting table component (Left Box & Right Box with Back & Lay odds)
 * matching the Player A & Player B reference design.
 *
 * Props:
 * @prop {string}   [leftTitle]       – Title for left box header (e.g. 'Player A')
 * @prop {string}   [rightTitle]      – Title for right box header (e.g. 'Player B')
 * @prop {string}   [leftHeaderBack]  – Header label for left back column (default: 'Back')
 * @prop {string}   [leftHeaderLay]   – Header label for left lay column (default: 'Lay')
 * @prop {string}   [rightHeaderBack] – Header label for right back column (default: 'Back')
 * @prop {string}   [rightHeaderLay]  – Header label for right lay column (default: 'Lay')
 * @prop {Array}    [leftRunners]     – [{ id, name, back, lay, suspended, suspendedBack, suspendedLay, dataTitle }]
 * @prop {Array}    [rightRunners]    – [{ id, name, back, lay, suspended, suspendedBack, suspendedLay, dataTitle }]
 * @prop {Function} [onBetClick]      – (runnerName, odds, type, isSuspended) => void
 * @prop {string}   [className]       – Additional CSS classes
 * @prop {ReactNode}[children]        – Custom children if not using runner props
 */

import './style.css'

function TableColumn({
  title,
  headerBack = 'Back',
  headerLay = 'Lay',
  runners = [],
  onBetClick,
  columnClass = '',
}) {
  const handleBet = (runnerName, odds, type, isSuspended) => {
    if (isSuspended || !odds || Number(odds) <= 0) return
    if (onBetClick) {
      onBetClick(runnerName, odds, type, isSuspended)
    }
  }

  return (
    <div className={columnClass}>
      <div className="casino-table-header">
        <div className="casino-nation-detail">{title}</div>
        {headerBack && <div className="casino-odds-box back">{headerBack}</div>}
        {headerLay && <div className="casino-odds-box lay">{headerLay}</div>}
      </div>
      <div className="casino-table-body">
        {runners.map((runner) => {
          const isBackSuspended = runner.suspended || runner.suspendedBack || !runner.back || Number(runner.back) === 0
          const isLaySuspended = runner.suspended || runner.suspendedLay || !runner.lay || Number(runner.lay) === 0
          const isWrapperSuspended = runner.suspended || (isBackSuspended && isLaySuspended && runner.suspendedWrapper)

          return (
            <div className="casino-table-row" key={runner.id || runner.name}>
              <div className="casino-nation-detail">
                <div className="casino-nation-name">{runner.name}</div>
              </div>
              <div
                className={`casino-odds-box-wrapper ${isWrapperSuspended ? 'suspended-box' : ''}`}
                data-title={runner.dataTitle || ''}
              >
                <div
                  className={`casino-odds-box back ${!isWrapperSuspended && isBackSuspended ? 'suspended-box' : ''}`}
                  onClick={() => handleBet(runner.betName || runner.name, runner.back, 'back', isBackSuspended)}
                  data-title={runner.dataTitle || ''}
                >
                  <span className="casino-odds">{runner.back || '0'}</span>
                </div>
                {headerLay && (
                  <div
                    className={`casino-odds-box lay ${!isWrapperSuspended && isLaySuspended ? 'suspended-box' : ''}`}
                    onClick={() => handleBet(runner.betName || runner.name, runner.lay, 'lay', isLaySuspended)}
                    data-title={runner.dataTitle || ''}
                  >
                    <span className="casino-odds">{runner.lay || '-'}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function CasinoDualTable({
  leftTitle = '',
  rightTitle = '',
  leftHeaderBack = 'Back',
  leftHeaderLay = 'Lay',
  rightHeaderBack = 'Back',
  rightHeaderLay = 'Lay',
  leftRunners,
  rightRunners,
  onBetClick,
  className = '',
  children,
}) {
  if (children) {
    return (
      <div className={`casino-table-box ${className}`.trim()}>
        {children}
      </div>
    )
  }

  return (
    <div className={`casino-table-box ${className}`.trim()}>
      <TableColumn
        title={leftTitle}
        headerBack={leftHeaderBack}
        headerLay={leftHeaderLay}
        runners={leftRunners || []}
        onBetClick={onBetClick}
        columnClass="casino-table-left-box"
      />
      <TableColumn
        title={rightTitle}
        headerBack={rightHeaderBack}
        headerLay={rightHeaderLay}
        runners={rightRunners || []}
        onBetClick={onBetClick}
        columnClass="casino-table-right-box"
      />
    </div>
  )
}
