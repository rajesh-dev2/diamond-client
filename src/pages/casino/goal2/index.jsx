/**
 * Goal 2 — Live casino football betting page.
 * Route: /casino/goal2
 *
 * Encapsulated inside CasinoLayout (`gdv2-page`, `gdv2-layout`, `gdv2-main`, `gdv2-right-sidebar`, and `PlaceBetModal`).
 */

import { Link } from 'react-router-dom'
import FlipClock from '../../../components/FlipClock'
import CasinoMarket from '../../../components/CasinoMarket'
import NumberMarket from '../../../components/game-details/NumberMarket'
import CasinoLayout from '../../../components/CasinoLayout'
import './style.css'

/* ── Static market data ──────────────────────────────────────── */
const WHO_WILL_GOAL = [
  { id: 'wr-cr7',   name: 'Cristiano Ronaldo',  back: 6.53,  lay: 7.38,  vol: 100000, min: 100, max: 50000 },
  { id: 'wr-mes',   name: 'Lionel Messi',        back: 6.89,  lay: 7.77,  vol: 100000, min: 100, max: 50000 },
  { id: 'wr-lew',   name: 'Robert Lewandowski',  back: 7.96,  lay: 8.99,  vol: 100000, min: 100, max: 50000 },
  { id: 'wr-ben',   name: 'Karim Benzema',       back: 8.94,  lay: 10.09, vol: 100000, min: 100, max: 50000 },
  { id: 'wr-cav',   name: 'Edinson Cavani',      back: 9.99,  lay: 11.28, vol: 100000, min: 100, max: 50000 },
  { id: 'wr-sua',   name: 'Luis Suarez',          back: 11.32, lay: 12.78, vol: 100000, min: 100, max: 50000 },
  { id: 'wr-ney',   name: 'Neymar',               back: 12.74, lay: 14.38, vol: 100000, min: 100, max: 50000 },
  { id: 'wr-agu',   name: 'Sergio Aguero',        back: 14.15, lay: 15.98, vol: 100000, min: 100, max: 50000 },
  { id: 'wr-gir',   name: 'Olivier Giroud',       back: 15.92, lay: 17.98, vol: 100000, min: 100, max: 50000 },
  { id: 'wr-sal',   name: 'Mohamed Salah',        back: 16.98, lay: 19.18, vol: 100000, min: 100, max: 50000 },
  { id: 'wr-mbp',   name: 'Kylian Mbappe',        back: 18.2,  lay: 20.55, vol: 100000, min: 100, max: 50000 },
  { id: 'wr-nog',   name: 'No Goal',              back: 26.43, lay: 29.21, vol: 50000,  min: 100, max: 25000 },
]

const METHOD_GOAL = [
  { id: 'mg-shot', name: 'Shot Goal',      back: 1.92,  lay: 2.12,  vol: 100000, min: 100, max: 50000 },
  { id: 'mg-head', name: 'Header Goal',    back: 4.37,  lay: 4.83,  vol: 100000, min: 100, max: 50000 },
  { id: 'mg-pen',  name: 'Penalty Goal',   back: 6.53,  lay: 7.21,  vol: 100000, min: 100, max: 50000 },
  { id: 'mg-free', name: 'Free Kick Goal', back: 9.11,  lay: 10.07, vol: 100000, min: 100, max: 50000 },
  { id: 'mg-nog',  name: 'No Goal',        back: 26.43, lay: 29.21, vol: 50000,  min: 100, max: 25000 },
]

const COMBO_GOAL = [
  { id: 'c1',  name: 'Cristiano Ronaldo and Shot Goal',       back: 12.37, vol: 50000, min: 100, max: 25000, suspended: true },
  { id: 'c2',  name: 'Lionel Messi and Shot Goal',            back: 13.04, vol: 50000, min: 100, max: 25000, suspended: true },
  { id: 'c3',  name: 'Robert Lewandowski and Shot Goal',      back: 13.79, vol: 50000, min: 100, max: 25000, suspended: true },
  { id: 'c4',  name: 'Karim Benzema and Shot Goal',           back: 14.19, vol: 50000, min: 100, max: 25000, suspended: true },
  { id: 'c5',  name: 'Edinson Cavani and Shot Goal',          back: 20.98, vol: 50000, min: 100, max: 25000, suspended: true },
  { id: 'c6',  name: 'Luis Suarez and Shot Goal',             back: 22.98, vol: 50000, min: 100, max: 25000, suspended: true },
  { id: 'c7',  name: 'Neymar and Shot Goal',                  back: 26.81, vol: 50000, min: 100, max: 25000, suspended: true },
  { id: 'c8',  name: 'Sergio Aguero and Shot Goal',           back: 26.81, vol: 50000, min: 100, max: 25000, suspended: true },
  { id: 'c9',  name: 'Olivier Giroud and Shot Goal',          back: 26.81, vol: 50000, min: 100, max: 25000, suspended: true },
  { id: 'c10', name: 'Mohamed Salah and Shot Goal',           back: 26.81, vol: 50000, min: 100, max: 25000, suspended: true },
  { id: 'c11', name: 'Kylian Mbappe and Shot Goal',           back: 34.47, vol: 50000, min: 100, max: 25000, suspended: true },
  { id: 'c12', name: 'Cristiano Ronaldo and Header Goal',     back: 28.39, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c13', name: 'Lionel Messi and Header Goal',          back: 30.16, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c14', name: 'Robert Lewandowski and Header Goal',    back: 32.17, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c15', name: 'Karim Benzema and Header Goal',         back: 34.47, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c16', name: 'Edinson Cavani and Header Goal',        back: 43.87, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c17', name: 'Luis Suarez and Header Goal',           back: 48.26, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c18', name: 'Neymar and Header Goal',                back: 68.94, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c19', name: 'Sergio Aguero and Header Goal',         back: 48.26, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c20', name: 'Olivier Giroud and Header Goal',        back: 60.33, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c21', name: 'Mohamed Salah and Header Goal',         back: 80.43, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c22', name: 'Kylian Mbappe and Header Goal',         back: 68.94, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c23', name: 'Cristiano Ronaldo and Penalty Goal',    back: 40.22, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c24', name: 'Lionel Messi and Penalty Goal',         back: 53.62, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c25', name: 'Robert Lewandowski and Penalty Goal',   back: 60.33, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c26', name: 'Karim Benzema and Penalty Goal',        back: 68.94, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c27', name: 'Edinson Cavani and Penalty Goal',       back: 48.26, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c28', name: 'Luis Suarez and Penalty Goal',          back: 80.43, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c29', name: 'Neymar and Penalty Goal',               back: 60.33, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c30', name: 'Sergio Aguero and Penalty Goal',        back: 80.43, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c31', name: 'Olivier Giroud and Penalty Goal',       back: 96.52, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c32', name: 'Mohamed Salah and Penalty Goal',        back: 100,   vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c33', name: 'Kylian Mbappe and Penalty Goal',        back: 80.43, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c34', name: 'Cristiano Ronaldo and Free Kick Goal',  back: 48.26, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c35', name: 'Lionel Messi and Free Kick Goal',       back: 40.22, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c36', name: 'Robert Lewandowski and Free Kick Goal', back: 80.43, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c37', name: 'Karim Benzema and Free Kick Goal',      back: 100,   vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c38', name: 'Edinson Cavani and Free Kick Goal',     back: 68.94, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c39', name: 'Luis Suarez and Free Kick Goal',        back: 60.33, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c40', name: 'Neymar and Free Kick Goal',             back: 68.94, vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c41', name: 'Sergio Aguero and Free Kick Goal',      back: 100,   vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c42', name: 'Olivier Giroud and Free Kick Goal',     back: 100,   vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c43', name: 'Mohamed Salah and Free Kick Goal',      back: 100,   vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c44', name: 'Kylian Mbappe and Free Kick Goal',      back: 100,   vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c45', name: 'Cristiano Ronaldo and No Goal',         back: 100,   vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c46', name: 'Lionel Messi and No Goal',              back: 100,   vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c47', name: 'Robert Lewandowski and No Goal',        back: 100,   vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c48', name: 'Karim Benzema and No Goal',             back: 100,   vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c49', name: 'Edinson Cavani and No Goal',            back: 100,   vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c50', name: 'Luis Suarez and No Goal',               back: 100,   vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c51', name: 'Neymar and No Goal',                    back: 100,   vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c52', name: 'Sergio Aguero and No Goal',             back: 100,   vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c53', name: 'Olivier Giroud and No Goal',            back: 100,   vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c54', name: 'Mohamed Salah and No Goal',             back: 100,   vol: 20000, min: 100, max: 10000, suspended: true },
  { id: 'c55', name: 'Kylian Mbappe and No Goal',             back: 100,   vol: 20000, min: 100, max: 10000, suspended: true },
]

const LAST_RESULTS = Array(10).fill('R')
const ROUND_ID     = '196260818133059'

/* ═══════════════════════════════════════════════════════════════
   Goal2 — main page
   ═══════════════════════════════════════════════════════════════ */
export default function Goal2() {
  return (
    <CasinoLayout title="Goal 2" roundId={ROUND_ID}>
      {({ onOddClick }) => (
        <>
          {/* Video + FlipClock */}
          <div className="g2-video-section">
            <div className="g2-video-box">
              <iframe
                className="g2-iframe"
                src="about:blank"
                title="Goal 2 Live Stream"
                allowFullScreen
              />
              {/* 🔊 Audio mute / unmute button */}
              <button
                type="button"
                className="g2-audio-btn"
                aria-label="Toggle Audio"
              >
                <i className="fas fa-volume-mute" />
              </button>

              {/* 🕐 FlipClock — bottom-right (2-digit casino countdown) */}
              <FlipClock position="bottom-right" seconds={30} size="md" />
            </div>
          </div>

          {/* Side-by-Side Markets (Image 2) */}
          <div className="gdv2-fancy-grid" style={{ marginBottom: 4 }}>
            {/* Market 1: Who Will Goal Next? */}
            <div className="gdv2-fancy-col">
              <CasinoMarket
                title="Who Will Goal Next?"
                runners={WHO_WILL_GOAL}
                hasLay
                onOddClick={onOddClick}
              />
            </div>

            {/* Market 2: Method Of Next Goal */}
            <div className="gdv2-fancy-col">
              <CasinoMarket
                title="Method Of Next Goal"
                runners={METHOD_GOAL}
                hasLay
                onOddClick={onOddClick}
              />
            </div>
          </div>

          {/* Market 3: Method Of Combination Goal using NumberMarket (Image 3) */}
          <NumberMarket
            title="Method Of Combination Goal"
            runners={COMBO_GOAL}
            dualColumn
            onOddClick={onOddClick}
          />

          {/* Last Results */}
          <div className="g2-last-results-wrap">
            <div className="g2-last-results-title">
              <span>Last Result</span>
              <Link to="/casino-results">View All</Link>
            </div>
            <div className="g2-last-results">
              {LAST_RESULTS.map((r, i) => (
                <span key={i} className="g2-result-badge">{r}</span>
              ))}
            </div>
          </div>
        </>
      )}
    </CasinoLayout>
  )
}




