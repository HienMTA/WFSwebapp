
import React from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';
import { SunIcon, MoonIcon, BellIcon, SearchIcon } from '../icons/Icons';
import { useAuth } from '../../context/AuthContext';


const Header: React.FC = () => {
  const [theme, toggleTheme] = useDarkMode();
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white dark:bg-gray-800 shadow-md flex items-center justify-between px-6 z-10">
      <div className="flex items-center">
        <div className="relative">
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cases, evidence..."
            className="bg-gray-100 dark:bg-gray-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent rounded-full py-2 pl-10 pr-4 w-64 text-gray-700 dark:text-gray-300"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
          {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
        </button>
        <button className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
          <BellIcon className="w-6 h-6" />
          <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-gray-800"></span>
        </button>
        <div className="flex items-center space-x-3">
          <img src={`https://i.pravatar.cc/40?u=${user?.user_id}`} alt="User Avatar" className="w-10 h-10 rounded-full" />
          <div>
            <div className="font-semibold">{user?.full_name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role.toLowerCase()}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
