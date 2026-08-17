import './style.css'
import { formatAmount } from '../utils'

export default function MinMaxLabel({ min, max }) {
  return (
    <div className="gdv2-minmax">
      {min && <span>Min: {formatAmount(min)}</span>}
      {max && <span>Max: {formatAmount(max)}</span>}
    </div>
  )
}
