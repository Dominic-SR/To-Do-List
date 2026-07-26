// import { Outlet } from 'react-router-dom'
// import Navbar from '../components/Navbar'
// import Footer from '../components/Footer'

// export default function MainLayout() {
//   return (
//     <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
//       <Navbar />
//       <main className="flex-grow container mx-auto px-4 py-8">
//         <Outlet />
//       </main>
//       <Footer />
//     </div>
//   )
// }


import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false) // Desktop collapse state

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Menu with Toggle states passed */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Dashboard Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-slate-600 hover:text-slate-900 focus:outline-none p-2"
            aria-label="Open Sidebar"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="text-sm font-semibold text-slate-800">
            Welcome back, User 👋
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              U
            </div>
          </div>
        </header>

        {/* Dynamic Page View Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}