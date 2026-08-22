/**
 * FlipClock
 * ─────────
 * Casino-style countdown flip-clock component based on flipTimer.
 *
 * Props
 * ─────
 * @prop {number}   seconds     – Total seconds to count down (default: 30)
 * @prop {string}   position    – 'top-left' | 'bottom-left' | 'bottom-right' | '' (default: 'bottom-right')
 * @prop {string}   size        – 'sm' | 'md' | 'lg' (default: 'md')
 * @prop {boolean}  showMinutes – Whether to show MM:SS (default: false, renders 2-digit SS)
 * @prop {boolean}  showLabels  – Whether to show MIN / SEC labels (default: false)
 * @prop {boolean}  showColon   – Whether to render colon if showMinutes=true (default: true)
 * @prop {function} onExpire    – Callback when timer reaches 0
 * @prop {string}   className   – Additional custom classes
 */

import { useState, useEffect, useRef } from 'react'
import './style.css'

/* ── Single animated digit set ─────────────────────────────────── */
function DigitSet({ current, previous }) {
  const [animating, setAnimating] = useState(false)
  const [displayPrev, setDisplayPrev] = useState(previous ?? current)
  const prevRef = useRef(current)

  useEffect(() => {
    if (prevRef.current !== current) {
      setDisplayPrev(prevRef.current)
      setAnimating(true)
      prevRef.current = current

      const timer = setTimeout(() => {
        setAnimating(false)
      }, 600)

      return () => clearTimeout(timer)
    }
  }, [current])

  return (
    <div className="digit-set">
      {animating && (
        <div className="digit previous">
          <div className="digit-top">
            <span className="digit-wrap">{displayPrev}</span>
          </div>
          <div className="shadow-top" />
          <div className="digit-bottom">
            <span className="digit-wrap">{displayPrev}</span>
          </div>
          <div className="shadow-bottom" />
        </div>
      )}

      <div className={`digit active ${animating ? 'animating' : ''}`}>
        <div className="digit-top">
          <span className="digit-wrap">{current}</span>
        </div>
        <div className="shadow-top" />
        <div className="digit-bottom">
          <span className="digit-wrap">{current}</span>
        </div>
        <div className="shadow-bottom" />
      </div>
    </div>
  )
}

/* ── Digit pair (tens + units) ───────────────────────────────────── */
function DigitPair({
  value,
  prevValue,
  wrapperClass = 'seconds-wrapper',
  unitClass = 'seconds',
  label = '',
  showLabel = false,
}) {
  const cur0 = Math.floor(value / 10)
  const cur1 = value % 10
  const prev0 = Math.floor(prevValue / 10)
  const prev1 = prevValue % 10

  return (
    <div className={wrapperClass}>
      <div className={unitClass}>
        <DigitSet current={cur0} previous={prev0} />
        <DigitSet current={cur1} previous={prev1} />
        {showLabel && label && <div className="flipTimer-label">{label}</div>}
      </div>
    </div>
  )
}

export default function FlipClock({
  seconds = 30,
  position = 'bottom-right',
  size = 'md',
  showMinutes = false,
  showLabels = false,
  showColon = true,
  onExpire,
  className = '',
}) {
  const [timeLeft, setTimeLeft] = useState(seconds)
  const [prevTime, setPrevTime] = useState(seconds)
  const onExpireRef = useRef(onExpire)

  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

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
  const prevSec = Math.max(0, prevTime)

  const mins = Math.floor(totalSec / 60)
  const secs = totalSec % 60
  const prevMins = Math.floor(prevSec / 60)
  const prevSecs = prevSec % 60

  const sizeClass = size === 'md' ? '' : `size-${size}`
  const cls = ['flipTimer', position, sizeClass, className].filter(Boolean).join(' ')

  return (
    <div className={cls} role="timer" aria-live="off">
      {showMinutes ? (
        <>
          <DigitPair
            value={mins}
            prevValue={prevMins}
            wrapperClass="minutes-wrapper"
            unitClass="minutes"
            label="Min"
            showLabel={showLabels}
          />
          {showColon && <span className="seperator">:</span>}
          <DigitPair
            value={secs}
            prevValue={prevSecs}
            wrapperClass="seconds-wrapper"
            unitClass="seconds"
            label="Sec"
            showLabel={showLabels}
          />
        </>
      ) : (
        <DigitPair
          value={totalSec}
          prevValue={prevSec}
          wrapperClass="seconds-wrapper"
          unitClass="seconds"
          label="Sec"
          showLabel={showLabels}
        />
      )}
    </div>
  )
}
