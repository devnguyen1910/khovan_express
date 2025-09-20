import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Shipments from './components/Shipments';
import Suppliers from './components/Suppliers';

type View = 'Dashboard' | 'Inventory' | 'Shipments' | 'Suppliers';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('Dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'Inventory':
        return <Inventory />;
      case 'Shipments':
        return <Shipments />;
      case 'Suppliers':
        return <Suppliers />;
      case 'Dashboard':
      default:
        return <Dashboard />;
    }
  };

  const viewTitles: { [key in View]: string } = {
    Dashboard: 'Bảng điều khiển tổng quan',
    Inventory: 'Quản lý hàng tồn kho',
    Shipments: 'Theo dõi lô hàng',
    Suppliers: 'Quản lý nhà cung cấp',
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={viewTitles[activeView]} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-slate-900 p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
