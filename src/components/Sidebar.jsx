import { Link, useLocation } from 'react-router-dom'

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation()

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Analytics', path: '/dashboard/analytics', icon: '📈' },
    { name: 'Settings', path: '/dashboard/settings', icon: '⚙️' },
  ]

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out
        md:static md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Brand / Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <Link to="/dashboard" className="text-xl font-bold text-indigo-600">
            AppPanel
          </Link>
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden text-slate-500 hover:text-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{link.icon}</span>
                {link.name}
              </Link>
            )
          })}
        </div>

        {/* Sidebar Footer / User Profile snippet */}
        <div className="p-4 border-t border-slate-200">
          <Link 
            to="/" 
            className="block text-center text-sm font-medium text-slate-500 hover:text-slate-800 py-2"
          >
            ← Back to Website
          </Link>
        </div>
      </aside>
    </>
  )
}