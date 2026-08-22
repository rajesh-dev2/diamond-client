/**
 * CasinoPage — dispatcher
 * Reads :gameId from the URL and renders the matching casino page.
 * Route: /casino/:gameId
 */

import { useParams } from 'react-router-dom'
import Goal2 from './goal2'
import Worli3 from './worli3'
import Teen62 from './teen62'
import Card32 from './card32'
import Card32B from './card32eu'
import Lucky7 from './lucky7'

const CASINO_MAP = {
  // ── Goal ──
  goal2: Goal2,
  goal: Goal2,

  // ── Matka / Worli ──
  worli3: Worli3,
  worli: Worli3,
  worli2: Worli3,
  matka: Worli3,

  // ── Teenpatti Variants ──
  teen62: Teen62,
  teenpatti1day: Teen62,
  'teenpatti-1day': Teen62,
  teen: Teen62,
  teen20: Teen62,
  teen20v1: Teen62,
  teen20b: Teen62,
  teen20c: Teen62,
  teen9: Teen62,
  teen8: Teen62,
  teen3: Teen62,
  teen6: Teen62,
  teen32: Teen62,
  teen33: Teen62,
  teen41: Teen62,
  teen42: Teen62,
  teenunique: Teen62,
  teenmuf: Teen62,
  teensin: Teen62,
  teen1: Teen62,
  teen120: Teen62,
  poison: Teen62,
  poison20: Teen62,
  joker1: Teen62,
  joker20: Teen62,
  joker120: Teen62,

  // ── 32 Cards A & B ──
  card32: Card32,
  cards32: Card32,
  cards32a: Card32,
  '32cards': Card32,
  '32cardsa': Card32,
  '32card': Card32,
  card32eu: Card32B,
  cards32b: Card32B,
  '32cardeu': Card32B,
  '32cardsb': Card32B,

  // ── Lucky 7 Variants ──
  lucky7: Lucky7,
  lucky7eu: Lucky7,
  lucky7eu2: Lucky7,
  lucky7a: Lucky7,
  lucky7b: Lucky7,
  lucky7c: Lucky7,
  'lucky-7': Lucky7,
  lucky5: Lucky7,
  lucky15: Lucky7,
}

export default function CasinoPage() {
  const { gameId } = useParams()
  const key = (gameId || '').toLowerCase().trim()

  // Exact match
  let Page = CASINO_MAP[key]

  // Pattern-based fallback so no casino page ever renders blank
  if (!Page) {
    if (key.includes('32') || key.includes('card32')) {
      Page = key.includes('eu') || key.includes('b') ? Card32B : Card32
    } else if (key.includes('lucky') || key.includes('7')) {
      Page = Lucky7
    } else if (key.includes('teen') || key.includes('poker') || key.includes('baccarat') || key.includes('dt') || key.includes('ab')) {
      Page = Teen62
    } else if (key.includes('worli') || key.includes('matka')) {
      Page = Worli3
    } else if (key.includes('goal')) {
      Page = Goal2
    } else {
      Page = Card32 // Default fallback
    }
  }

  return <Page />
}
