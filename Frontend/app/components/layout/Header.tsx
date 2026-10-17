import { useState } from 'react';
import { Link, NavLink } from 'react-router/internal/react-server-client';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/habits', label: 'Habits' },
    { to: '/library', label: 'Library' },
    { to: '/expenses', label: 'Expenses' },
    { to: '/inspiration', label: 'Inspiration' },
  ];

  return (
    <header className='sticky top-0 z-50 border-b border-[#EEEEEE]/60 bg-white/70 backdrop-blur-md transition-all duration-300'>
      <nav className='mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6'>
        {/* Logo / Brand */}
        <Link
          to='/'
          className='text-[15px] font-medium tracking-tight text-[#171A20]'
        >
          Growth OS
        </Link>

        {/* Desktop Nav Links */}
        <div className='hidden md:flex items-center gap-6 text-sm font-medium'>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? 'text-[#3E6AE1]'
                  : 'text-[#393C41] hover:text-[#171A20]'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='md:hidden p-2 text-[#171A20] focus:outline-none'
          aria-label='Toggle menu'
        >
          <svg
            className='w-6 h-6 transition-transform duration-200'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            {isOpen ? (
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            ) : (
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Dropdown Drawer */}
      {isOpen && (
        <div className='md:hidden absolute top-14 left-0 w-full bg-white/90 backdrop-blur-lg border-b border-[#EEEEEE] shadow-sm py-4 px-6 flex flex-col gap-4 transition-all animate-fadeIn'>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)} // Close menu on click
              className={({ isActive }) =>
                `text-base font-medium ${
                  isActive
                    ? 'text-[#3E6AE1]'
                    : 'text-[#393C41] hover:text-[#171A20]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
