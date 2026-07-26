import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link to="/" onClick={closeMenu} className="text-xl font-bold text-indigo-600">
              BrandLogo
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              Dashboard
            </Link>
            <Link to="/about" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              Contact
            </Link>
          </div>

          {/* Desktop Action Buttons (e.g., Login / Get Started) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-medium text-sm">
              Log in
            </Link>
            <Link 
              to="/signup" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="text-slate-600 hover:text-slate-900 focus:outline-none p-2 rounded-md"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                // Close Icon (X)
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger Icon
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <Link 
            to="/" 
            onClick={closeMenu} 
            className="block text-slate-700 hover:text-indigo-600 font-medium py-2"
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            onClick={closeMenu} 
            className="block text-slate-700 hover:text-indigo-600 font-medium py-2"
          >
            Dashboard
          </Link>
          <Link 
            to="/about" 
            onClick={closeMenu} 
            className="block text-slate-700 hover:text-indigo-600 font-medium py-2"
          >
            About
          </Link>
          <Link 
            to="/contact" 
            onClick={closeMenu} 
            className="block text-slate-700 hover:text-indigo-600 font-medium py-2"
          >
            Contact
          </Link>
          
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
            <Link 
              to="/login" 
              onClick={closeMenu} 
              className="text-center text-slate-700 hover:text-indigo-600 font-medium py-2"
            >
              Log in
            </Link>
            <Link 
              to="/signup" 
              onClick={closeMenu} 
              className="text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}