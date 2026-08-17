import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons'

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="wrapper min-h-screen">
      {/* Header section */}
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Container: Sidebar + Page Outlet */}
      <div className="main-container flex grow w-full md:mt-1 bg-white">
        {/* Left Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Center Main Content Area Outlet */}
        <main className="center-main-container grow md:pl-1.25 pt-0 overflow-x-clip">
          <Outlet />
        </main>

      </div>

      {/* Footer matching IceBook9 SS1 */}
      <section className="footer footer-login bg-black border-t border-slate-800 text-slate-400 text-xs mt-auto">
        <div className="footer-top py-2.5 px-6 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="footer-links">
            <nav className="navbar navbar-expand-sm">
              <ul className="navbar-nav flex items-center gap-4 m-0 p-0 list-none">
                <li className="nav-item">
                  <Link className="nav-link text-white font-bold hover:underline" to="/terms-and-conditions" target="_blank">
                    Terms and Conditions
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white font-bold hover:underline" to="/responsible-gaming" target="_blank">
                    Responsible Gaming
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="support-detail text-center">
            <h2 className="text-white font-bold text-sm m-0">24X7 Support</h2>
            <p className="m-0"></p>
          </div>
          <div className="social-icons-box"></div>
        </div>
      </section>

      <div className="footer-bottom py-3 px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 bg-[#080c10]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded text-[10px] font-bold">
            <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-400" />
            <span>100% SAFE</span>
          </div>
          <span>Protected connection and encrypted data.</span>
        </div>

        <div className="footer-text text-center font-medium">
          © Copyright 2026. All Rights Reserved. Powered by ICEBOOK9.
        </div>

        <div className="flex items-center gap-2 font-bold text-slate-300">
          <span className="w-6 h-6 rounded-full border border-slate-600 flex items-center justify-center text-[10px]">18+</span>
          <span className="w-6 h-6 rounded-full border border-slate-600 flex items-center justify-center text-[10px]">gt</span>
          <span className="w-6 h-6 rounded-full border border-slate-600 flex items-center justify-center text-[10px]">g</span>
        </div>
      </div>
    </div>
  )
}
