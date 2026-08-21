/**
 * FlipClock
 * ─────────
 * Casino-style countdown flip-clock component.
 *
 * Props
 * ─────
 * @prop {number}   seconds     – Total seconds to count down (default: 30)
 * @prop {string}   position    – 'top-left' | 'bottom-left' | 'bottom-right' (default: 'bottom-right')
 * @prop {string}   size        – 'sm' | 'md' | 'lg' (default: 'md')
 * @prop {boolean}  showMinutes – Whether to show MM:SS (default: false, renders 2-digit SS)
 * @prop {boolean}  showLabels  – Whether to show MIN / SEC labels (default: false)
 * @prop {boolean}  showColon   – Whether to render colon if showMinutes=true (default: true)
 * @prop {function} onExpire    – Callback when timer reaches 0
 */

import { useState, useEffect, useRef } from 'react'
import './style.css'

/* ── Single animated digit card ─────────────────────────────────── */
function FlipCard({ current, previous }) {
  const leafRef = useRef(null)
  const isChange = current !== previous

  useEffect(() => {
    if (!isChange || !leafRef.current) return
    const leaf = leafRef.current
    leaf.classList.remove('is-flipping')
    void leaf.offsetWidth
    leaf.classList.add('is-flipping')

    const onEnd = () => leaf.classList.remove('is-flipping')
    leaf.addEventListener('animationend', onEnd, { once: true })
    return () => leaf.removeEventListener('animationend', onEnd)
  }, [current, isChange])

  return (
    <div className="fc-digit-card">
      {/* Upper static half */}
      <div className="fc-card-face fc-upper">
        <span className="fc-text">{current}</span>
      </div>

      {/* Lower static half */}
      <div className="fc-card-face fc-lower">
        <span className="fc-text">{current}</span>
      </div>

      {/* Animated flip leaf */}
      <div className="fc-leaf" ref={leafRef}>
        <div className="fc-leaf-front">
          <span className="fc-text">{previous}</span>
        </div>
        <div className="fc-leaf-back">
          <span className="fc-text">{current}</span>
        </div>
      </div>

      {/* Center divider groove */}
      <div className="fc-divider" />
    </div>
  )
}

/* ── Digit pair (tens + units) ───────────────────────────────────── */
function DigitPair({ value, prevValue }) {
  const cur0  = Math.floor(value / 10)
  const cur1  = value % 10
  const prev0 = Math.floor(prevValue / 10)
  const prev1 = prevValue % 10

  return (
    <div className="fc-digit-group">
      <FlipCard current={cur0} previous={prev0} />
      <FlipCard current={cur1} previous={prev1} />
    </div>
  )
}

/* ── Blinking Colon ──────────────────────────────────────────────── */
function Colon() {
  return (
    <div className="fc-colon" aria-hidden="true">
      <span />
      <span />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   FlipClock — Main Export
   ═══════════════════════════════════════════════════════════════════ */
export default function FlipClock({
  seconds     = 30,
  position    = 'bottom-right',
  size        = 'md',
  showMinutes = false,
  showLabels  = false,
  showColon   = true,
  onExpire,
}) {
  const [timeLeft, setTimeLeft] = useState(seconds)
  const [prevTime, setPrevTime] = useState(seconds)
  const onExpireRef = useRef(onExpire)

  useEffect(() => { onExpireRef.current = onExpire }, [onExpire])

  useEffect(() => {
    setTimeLeft(seconds)
    setPrevTime(seconds)
  }, [seconds])

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpireRef.current?.()
      return
    }
    const id = setTimeout(() => {
      setPrevTime(timeLeft)
      setTimeLeft((t) => t - 1)
    }, 1000)
    return () => clearTimeout(id)
  }, [timeLeft])

  const totalSec = Math.max(0, timeLeft)
  const prevSec  = Math.max(0, prevTime)

  const mins     = Math.floor(totalSec / 60)
  const secs     = totalSec % 60
  const prevMins = Math.floor(prevSec / 60)
  const prevSecs = prevSec % 60

  const sizeClass = size === 'md' ? '' : `fc-${size}`
  const cls = ['flip-clock-wrapper', position, sizeClass].filter(Boolean).join(' ')

  return (
    <div className={cls} role="timer" aria-live="off">
      {showMinutes ? (
        <>
          {/* Minutes */}
          <div className="fc-block">
            <DigitPair value={mins} prevValue={prevMins} />
            {showLabels && <span className="fc-label">Min</span>}
          </div>

          {showColon && <Colon />}

          {/* Seconds */}
          <div className="fc-block">
            <DigitPair value={secs} prevValue={prevSecs} />
            {showLabels && <span className="fc-label">Sec</span>}
          </div>
        </>
      ) : (
        /* 2-digit seconds clock (Standard Casino Style) */
        <div className="fc-block">
          <DigitPair value={totalSec} prevValue={prevSec} />
          {showLabels && <span className="fc-label">Sec</span>}
        </div>
      )}
    </div>
  )
}

