import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faHome } from '@fortawesome/free-solid-svg-icons'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-4 max-w-md">
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500 text-6xl animate-bounce" />
        <h1 className="text-4xl font-extrabold">404 - Page Not Found</h1>
        <p className="text-slate-400 text-sm">
          The requested page could not be located.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl hover:bg-amber-400 transition-colors text-sm"
        >
          <FontAwesomeIcon icon={faHome} />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  )
}
