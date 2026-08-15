import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faShieldHeart } from '@fortawesome/free-solid-svg-icons'
import logo from '../../assets/brand-logo/logo.png'

export default function ResponsibleGaming() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900 border-b border-slate-800 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-amber-400 font-semibold text-xs flex items-center gap-2 hover:underline">
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Back to Home</span>
          </Link>
          <img src={logo} alt="IceBook Logo" className="h-8 w-auto" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full px-4 py-8 flex-grow space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <FontAwesomeIcon icon={faShieldHeart} className="text-emerald-400 text-3xl" />
          <h1 className="text-2xl font-bold text-white">Responsible Gaming</h1>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs leading-relaxed text-slate-300">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-emerald-400">Play Responsibly</h2>
            <p>
              Gaming should always be entertainment, not a way to make money or escape problems. IceBook9 is committed to providing a safe, enjoyable environment for all users.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-emerald-400">Self-Exclusion & Limits</h2>
            <p>
              We provide tools to set deposit limits, session timers, or request temporary self-exclusion whenever needed. Contact our 24X7 support for assistance.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
