/**
 * CasinoPage — dispatcher
 * Reads :gameId from the URL and renders the matching casino page.
 * Route: /casino/:gameId
 */

import { useParams, Navigate } from 'react-router-dom'
import Goal2 from './goal2'
import Worli3 from './worli3'
import Teen62 from './teen62'
import Teen from './teen'
import Card32 from './card32'
import Card32B from './card32eu'
import Lucky7 from './lucky7'
import Lucky7B from './lucky7eu'
import Ab20 from './ab20'
import Abj from './abj'
import Dt6 from './dt6'

const CASINO_MAP = {
  goal2: Goal2,
  worli3: Worli3,
  teen62: Teen62,
  teen: Teen,
  card32: Card32,
  card32eu: Card32B,
  lucky7: Lucky7,
  lucky7eu: Lucky7B,
  ab20: Ab20,
  abj20: Ab20,
  ab: Ab20,
  'andar-bahar': Ab20,
  abj: Abj,
  ab2: Abj,
  'andar-bahar-2': Abj,
  dt6: Dt6,
  'dragon-tiger': Dt6,
  'dt1day': Dt6,
}


export default function CasinoPage() {
  const { gameId } = useParams()
  const key = (gameId || '').toLowerCase().trim()

  const Page = CASINO_MAP[key]

  if (!Page) {
    return <Navigate to="/home" replace />
  }

  return <Page />
}

