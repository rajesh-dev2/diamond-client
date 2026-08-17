import './style.css'
import { formatAmount } from '../utils'

const VARIANT_MAP = {
  back:  'gdv2-back',
  back1: 'gdv2-back1',
  back2: 'gdv2-back2',
  lay:   'gdv2-lay',
  lay1:  'gdv2-lay1',
  lay2:  'gdv2-lay2',
}

/**
 * OddBox — single clickable odds cell.
 *
 * Can render either:
 *   • odd + volume (data mode)  — pass `odd` + `volume` props (volume automatically formatted as short notation)
 *   • suspended lock overlay    — pass `suspended={true}` (keeps numbers visible underneath)
 *   • children (label mode)     — pass JSX children (used by MarketHeader)
 */
export default function OddBox({ odd, volume, variant = 'back', onClick, disabled, suspended, className = '', children }) {
  const cls = [
    'gdv2-odd-box',
    VARIANT_MAP[variant] || 'gdv2-back',
    disabled ? 'gdv2-odd-disabled' : '',
    suspended ? 'gdv2-odd-suspended' : '',
    className,
  ].filter(Boolean).join(' ')

  const formattedVolume = volume != null && volume !== '' ? formatAmount(volume) : ''

  return (
    <div className={cls} onClick={disabled || suspended ? undefined : onClick}>
      {children ?? (
        <>
          <span className="gdv2-odd-price">{odd ?? '-'}</span>
          {formattedVolume>0 && <span className="gdv2-odd-volume">{formattedVolume}</span>}
        </>
      )}
      {suspended && (
        <div className="gdv2-odd-lock-overlay">
          <svg
            className="gdv2-lock-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zM264 392c0 22.1-17.9 40-40 40s-40-17.9-40-40v-48c0-22.1 17.9-40 40-40s40 17.9 40 40v48zm32-168H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z" />
          </svg>
        </div>
      )}
    </div>
  )
}
