
import React from 'react';
import { NAV_LINKS } from '../constants';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="w-64 bg-white dark:bg-slate-800 flex flex-col flex-shrink-0 shadow-lg">
      <div className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
          KhoVận<span className="font-light text-slate-500">Express</span>
        </h1>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {NAV_LINKS.map((link) => {
            const isActive = activeView === link.view;
            return (
              <li key={link.name}>
                <button
                  onClick={() => setActiveView(link.view)}
                  className={`flex items-center w-full px-4 py-3 my-1 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-primary-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <link.icon className="w-6 h-6 mr-4" />
                  <span className="font-medium">{link.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center">
            <img src="https://i.pravatar.cc/40" alt="User Avatar" className="w-10 h-10 rounded-full" />
            <div className="ml-3">
                <p className="font-semibold text-sm">Minh Anh</p>
                <p className="text-xs text-slate-500">Quản lý kho</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
