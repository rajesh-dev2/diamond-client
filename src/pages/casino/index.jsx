/**
 * CasinoPage — dispatcher
 * Reads :gameId from the URL and renders the matching casino page.
 * Route: /casino/:gameId
 *
 * To add a new game, import it and add an entry to CASINO_MAP.
 */

import { useParams } from 'react-router-dom'
import NotFound from '../not-found'

// ── Registered casino pages ──────────────────────────────────────
import Goal2 from './goal2'
import Worli3 from './worli3'

const CASINO_MAP = {
  goal2: Goal2,
  worli3: Worli3,
  worli: Worli3,
  matka: Worli3,
}

export default function CasinoPage() {
  const { gameId } = useParams()
  const Page = CASINO_MAP[gameId]

  if (!Page) return <NotFound />
  return <Page />
}
