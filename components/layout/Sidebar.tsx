import React from 'react';
import { NavLink } from 'react-router-dom';
import { DashboardIcon, CaseIcon, UsersIcon, AnalysisIcon, SettingsIcon, LogoutIcon, ComputerDesktopIcon } from '../icons/Icons';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

const Sidebar: React.FC = () => {
  const navLinkClasses = "flex items-center px-4 py-2.5 text-gray-400 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-200";
  const activeNavLinkClasses = "bg-primary-600 text-white";
  const { user, logout } = useAuth();

  return (
    <div className="w-64 bg-gray-800 dark:bg-gray-950 flex flex-col">
      <div className="h-20 flex items-center justify-center border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">WFS</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        <NavLink to="/" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
          <DashboardIcon className="w-5 h-5 mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/cases" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
          <CaseIcon className="w-5 h-5 mr-3" />
          Case Management
        </NavLink>
        
        {(user?.role === UserRole.ADMIN || user?.role === UserRole.INVESTIGATOR) && (
          <NavLink to="/hosts" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <ComputerDesktopIcon className="w-5 h-5 mr-3" />
            Host Management
          </NavLink>
        )}

        {user?.role === UserRole.ADMIN && (
          <NavLink to="/users" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <UsersIcon className="w-5 h-5 mr-3" />
            User Management
          </NavLink>
        )}
        
        {(user?.role === UserRole.ADMIN || user?.role === UserRole.INVESTIGATOR || user?.role === UserRole.ANALYST) && (
          <NavLink to="/analysis" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <AnalysisIcon className="w-5 h-5 mr-3" />
            Analysis Tools
          </NavLink>
        )}
        
        {user?.role === UserRole.ADMIN && (
          <NavLink to="/settings" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <SettingsIcon className="w-5 h-5 mr-3" />
            Settings
          </NavLink>
        )}
      </nav>
      <div className="px-4 py-4 border-t border-gray-700">
        <button onClick={logout} className={`${navLinkClasses} w-full`}>
            <LogoutIcon className="w-5 h-5 mr-3" />
            Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
