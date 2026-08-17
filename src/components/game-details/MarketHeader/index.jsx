import './style.css'
import OddBox from '../OddBox'

/**
 * MarketHeader — universal header row above odds.
 *
 * Automatically aligns with any number of OddBoxes (1, 2, 3, 6, or any arbitrary columns).
 * Can be used by passing:
 *   • layout: 'ladder' | 'compact' | 'fancy' | 'number'
 *   • columns: array of { label, variant/side }
 *   • children: custom OddBox elements
 */
export default function MarketHeader({
  layout = 'ladder',
  minMaxLabel = '',
  hasLay = true,
  columns,
  showSpacer,
  children,
}) {
  const hasSpacer = showSpacer !== undefined ? showSpacer : (layout === 'fancy')

  return (
    <div className="gdv2-market-header">
      <div className="gdv2-header-nation">
        {minMaxLabel && <span className="gdv2-header-minmax">{minMaxLabel}</span>}
      </div>
      <div className="gdv2-header-odds">
        {children ? (
          children
        ) : columns ? (
          columns.map((col, idx) => (
            <OddBox
              key={col.key || idx}
              variant={col.variant || col.cssClass || col.side || 'back'}
              odd={null}
              volume={null}
            >
              <b>{col.label || col.name || col.title}</b>
            </OddBox>
          ))
        ) : layout === 'ladder' ? (
          <>
            <div className="gdv2-odd-box gdv2-odd-empty" />
            <div className="gdv2-odd-box gdv2-odd-empty" />
            <OddBox variant="back" odd={null} volume={null}><b>Back</b></OddBox>
            <OddBox variant="lay" odd={null} volume={null}><b>Lay</b></OddBox>
            <div className="gdv2-odd-box gdv2-odd-empty" />
            <div className="gdv2-odd-box gdv2-odd-empty" />
          </>
        ) : layout === 'compact' ? (
          <>
            <OddBox variant="back" odd={null} volume={null}><b>Back</b></OddBox>
            <OddBox variant="lay" odd={null} volume={null}><b>Lay</b></OddBox>
          </>
        ) : layout === 'fancy' ? (
          <>
            {hasLay && <OddBox variant="lay" odd={null} volume={null}><b>No</b></OddBox>}
            <OddBox variant="back" odd={null} volume={null}><b>Yes</b></OddBox>
          </>
        ) : layout === 'number' ? (
          <OddBox variant="back" odd={null} volume={null}><b>Back</b></OddBox>
        ) : null}
      </div>
      {hasSpacer && <div className="gdv2-fancy-minmax-spacer" />}
    </div>
  )
}
