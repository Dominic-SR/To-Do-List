import { Link, useLocation } from 'react-router-dom'

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) {
  const location = useLocation()

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Home', path: '/', icon: '📈' },
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
        fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out
        md:static 
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-20' : 'md:w-64'}
        w-64
      `}>
        {/* Sidebar Brand / Header */}
        <div className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-slate-200">
          <Link 
            to="/dashboard" 
            className={`text-xl font-bold text-indigo-600 transition-opacity duration-200 ${
              isCollapsed ? 'md:hidden' : 'block'
            }`}
          >
            AppPanel
          </Link>

          {/* Desktop Collapse / Expand Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? '➡️' : '⬅️'}
          </button>

          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden text-slate-500 hover:text-slate-800 p-2"
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                title={isCollapsed ? link.name : ''}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="text-xl flex-shrink-0">{link.icon}</span>
                <span className={`transition-opacity duration-200 ${isCollapsed ? 'md:hidden' : 'block'}`}>
                  {link.name}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Sidebar Footer / Back to Website */}
        <div className="p-4 border-t border-slate-200">
          <Link 
            to="/" 
            className={`block text-center text-sm font-medium text-slate-500 hover:text-slate-800 py-2 transition-opacity duration-200 ${
              isCollapsed ? 'md:hidden' : 'block'
            }`}
          >
            ← Back to Website
          </Link>
          {isCollapsed && (
            <Link 
              to="/" 
              className="hidden md:block text-center text-lg text-slate-500 hover:text-slate-800 py-2"
              title="Back to Website"
            >
              🌐
            </Link>
          )}
        </div>
      </aside>
    </>
  )
}