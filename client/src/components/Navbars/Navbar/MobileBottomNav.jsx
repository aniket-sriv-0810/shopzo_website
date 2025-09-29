import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaTh, FaStore, FaUser, FaSignInAlt } from 'react-icons/fa';
import { useUser } from '../../UserContext/userContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { user } = useUser();

  const navItems = [
    {
      path: '/',
      icon: FaHome,
      label: 'Home',
      exact: true
    },
    {
      path: '/categories',
      icon: FaTh,
      label: 'Categories',
      exact: false
    },
    {
      path: '/vendors',
      icon: FaStore,
      label: 'Vendors',
      exact: false
    },
    {
      path: user && user._id ? `/user/${user._id}/account` : '/login',
      icon: user && user._id ? FaUser : FaSignInAlt,
      label: user && user._id ? 'Account' : 'Login',
      exact: false
    }
  ];

  const isActive = (path, exact) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around py-2 pb-safe">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.exact);
          
          return (
            <NavLink
              key={index}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 transition-colors duration-200 ${
                active 
                  ? 'text-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon 
                className={`w-5 h-5 mb-1 ${
                  active ? 'text-indigo-600' : 'text-gray-500'
                }`} 
              />
              <span 
                className={`text-xs font-medium truncate ${
                  active ? 'text-indigo-600' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;