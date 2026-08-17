// ── Back / Lay ladder column definitions ──────────────────────────────

// MATCH_ODDS / Bookmaker markets carry a 3-tier back/lay ladder per runner.
// Feed names the tiers back3..back1 (worst to best) and lay1..lay3 (best to worst);
// the UI's column classes use the opposite naming for the best-price column.
export const LADDER_COLUMNS = [
  { key: 'back3', cssClass: 'back2', side: 'back' },
  { key: 'back2', cssClass: 'back1', side: 'back' },
  { key: 'back1', cssClass: 'back',  side: 'back' },
  { key: 'lay1',  cssClass: 'lay',   side: 'lay'  },
  { key: 'lay2',  cssClass: 'lay1',  side: 'lay'  },
  { key: 'lay3',  cssClass: 'lay2',  side: 'lay'  },
]

export const COMPACT_LADDER_COLUMNS = [
  { key: 'back1', cssClass: 'back', side: 'back' },
  { key: 'lay1',  cssClass: 'lay',  side: 'lay'  },
]

// ── Odds helpers ──────────────────────────────────────────────────────

/** Build a { oname → oddEntry } map from a section's odds array */
export function oddsByName(section) {
  const map = {}
  ;(section.odds || []).forEach((o) => { map[o.oname] = o })
  return map
}

/**
 * Suspended / active state lives on section.gstatus, not the market's
 * top-level status. Blank gstatus is NOT suspended — it means tradable.
 */
export function isSuspended(section) {
  const status = (section.gstatus || '').toUpperCase()
  return status !== '' && status !== 'ACTIVE'
}

export function formatOdd(entry) {
  return entry && entry.odds ? String(entry.odds) : '-'
}

export function formatVol(entry) {
  return entry && entry.size != null ? formatAmount(entry.size) : ''
}

// ── Market type detection ─────────────────────────────────────────────

/**
 * Bookmaker / MATCH_ODDS / Tied Match render as a back/lay ladder keyed
 * by marketId+sid.  Everything else is fancy-style.
 */
export function isLadderMarket(market) {
  if (market.gtype === 'match') return true
  const name = (market.mname || '').toLowerCase()
  return name.startsWith('bookmaker') || name.includes('tied match')
}

/** Look up a section across all markets by its fancyId */
export function findSectionByFancyId(markets, fancyId) {
  for (const market of markets) {
    const section = market.section?.find((s) => s.fancyId === fancyId)
    if (section) return section
  }
  return null
}

// ── Book / PL helpers ─────────────────────────────────────────────────

export function bookBySid(book) {
  const map = {}
  ;(book || []).forEach((b) => { map[String(b.sid)] = b })
  return map
}

export function plByFancyId(pl) {
  const map = {}
  ;(pl || []).forEach((p) => { map[p.fancyId] = p })
  return map
}

// ── Indian number short-format ─────────────────────────────────────────
//
//  100         → "100"
//  1000        → "1K"
//  10000       → "10K"
//  50000       → "50K"
//  100000      → "1L"
//  500000      → "5L"
//  2000000     → "20L"
//  10000000    → "1Cr"
//
// Already-formatted strings (e.g. "5L", "10K") are returned as-is.

export function formatAmount(value) {
  if (value == null || value === '') return ''

  // If it's already a formatted string (ends with K / L / Cr), pass through
  if (typeof value === 'string' && /[KLCr]$/i.test(value.trim())) {
    return value.trim()
  }

  const num = Number(value)
  if (isNaN(num)) return String(value)

  if (num >= 10_000_000) {
    const cr = num / 10_000_000
    return `${cr % 1 === 0 ? cr : cr.toFixed(2).replace(/\.?0+$/, '')}Cr`
  }
  if (num >= 100_000) {
    const l = num / 100_000
    return `${l % 1 === 0 ? l : l.toFixed(2).replace(/\.?0+$/, '')}L`
  }
  if (num >= 1_000) {
    const k = num / 1_000
    return `${k % 1 === 0 ? k : k.toFixed(2).replace(/\.?0+$/, '')}K`
  }
  return String(num)
}

/**
 * Format a Min / Max label pair.
 * Returns e.g. "Min: 100  Max: 5L" or just "Max: 10K"
 */
export function formatMinMax(min, max) {
  const minStr = min != null && min !== '' ? `Min: ${formatAmount(min)}` : ''
  const maxStr = max != null && max !== '' ? `Max: ${formatAmount(max)}` : ''
  return [minStr, maxStr].filter(Boolean).join('\u00a0\u00a0')
}
