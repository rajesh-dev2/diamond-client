import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="wrapper min-h-screen flex flex-col">
      {/* Header section */}
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Container: Sidebar + Page Outlet */}
      <div className="main-container flex grow w-full md:mt-1 bg-white">
        {/* Left Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Center Main Content Area Outlet */}
        <main className="center-main-container grow md:pl-1.25 pt-0 overflow-x-clip min-w-0 max-w-full">
          <Outlet />
        </main>

      </div>

      {/* Footer matching DiamondExch */}
      <Footer />
    </div>
  )
}
