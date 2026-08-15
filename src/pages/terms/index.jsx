import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faFileContract } from '@fortawesome/free-solid-svg-icons'
import logo from '../../assets/brand-logo/logo.png'

export default function Terms() {
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
          <FontAwesomeIcon icon={faFileContract} className="text-amber-400 text-3xl" />
          <h1 className="text-2xl font-bold text-white">Terms and Conditions</h1>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs leading-relaxed text-slate-300">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-amber-400">1. Acceptance of Terms</h2>
            <p>
              By accessing and using IceBook9, you agree to be bound by these terms and conditions. Please read them carefully before using our gaming and betting platform services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-amber-400">2. Account Responsibility</h2>
            <p>
              Users are strictly responsible for maintaining the confidentiality of their credentials (Username and Password). Any actions performed through your account are your sole responsibility.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-amber-400">3. Fair Play Policy</h2>
            <p>
              IceBook9 enforces strict fair play policies. Any attempt to exploit system glitches, engage in automated bot usage, or commit fraudulent activity will result in instant account termination.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
