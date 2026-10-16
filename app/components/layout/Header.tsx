import { Link, NavLink } from "react-router/internal/react-server-client";

const Header = () => {
    return ( <header className="sticky top-0 z-50 border-b border-[#EEEEEE] bg-white/90 backdrop-blur-sm">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo / Brand */}
          <Link to="/" className="text-[15px] font-medium tracking-tight">
            Growth OS
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "text-[#3E6AE1]" : "text-[#393C41] hover:text-[#171A20]"
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/habits"
              className={({ isActive }) =>
                isActive ? "text-[#3E6AE1]" : "text-[#393C41] hover:text-[#171A20]"
              }
            >
              Habits
            </NavLink>

            <NavLink
              to="/library"
              className={({ isActive }) =>
                isActive ? "text-[#3E6AE1]" : "text-[#393C41] hover:text-[#171A20]"
              }
            >
              Library
            </NavLink>

            <NavLink
              to="/expenses"
              className={({ isActive }) =>
                isActive ? "text-[#3E6AE1]" : "text-[#393C41] hover:text-[#171A20]"
              }
            >
              Expenses
            </NavLink>

            <NavLink
              to="/inspiration"
              className={({ isActive }) =>
                isActive ? "text-[#3E6AE1]" : "text-[#393C41] hover:text-[#171A20]"
              }
            >
              Inspiration
            </NavLink>
          </div>
        </nav>
      </header> );
}
 
export default Header;