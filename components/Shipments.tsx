import React, { useEffect, useState } from 'react';
import { getShipments } from '../services/mockDataService';
import { Shipment, ShipmentStatus } from '../types';

const Shipments: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<ShipmentStatus | 'All'>('All');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getShipments();
      setShipments(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getStatusColor = (status: ShipmentStatus) => {
    switch (status) {
      case ShipmentStatus.Pending:
        return 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400';
      case ShipmentStatus.InTransit:
        return 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400';
      case ShipmentStatus.Delivered:
        return 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400';
      case ShipmentStatus.Cancelled:
        return 'bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300';
      case ShipmentStatus.Delayed:
        return 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const filteredShipments = shipments.filter(shipment => {
    if (filterStatus === 'All') {
      return true;
    }
    return shipment.status === filterStatus;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p>Đang tải danh sách lô hàng...</p></div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lô hàng ({filteredShipments.length})</h2>
        <div className="flex items-center space-x-4">
            <div>
                <label htmlFor="status-filter" className="sr-only">Lọc theo trạng thái</label>
                <select 
                    id="status-filter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as ShipmentStatus | 'All')}
                    className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-slate-700"
                >
                    <option value="All">Tất cả trạng thái</option>
                    {Object.values(ShipmentStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">Tạo lô hàng mới</button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
            <tr>
              <th scope="col" className="px-6 py-3">Mã vận đơn</th>
              <th scope="col" className="px-6 py-3">Điểm đi</th>
              <th scope="col" className="px-6 py-3">Điểm đến</th>
              <th scope="col" className="px-6 py-3">Trạng thái</th>
              <th scope="col" className="px-6 py-3">Giao hàng dự kiến</th>
              <th scope="col" className="px-6 py-3">Cân nặng</th>
              <th scope="col" className="px-6 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredShipments.map((shipment) => (
              <tr key={shipment.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <th scope="row" className="px-6 py-4 font-mono text-primary-600 dark:text-primary-400 whitespace-nowrap">
                  {shipment.trackingNumber}
                </th>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{shipment.origin}</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{shipment.destination}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(shipment.status)}`}>
                    {shipment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(shipment.estimatedDelivery).toLocaleDateString('vi-VN')}</td>
                 <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{shipment.weight} kg</td>
                <td className="px-6 py-4 text-right">
                  <a href="#" className="font-medium text-primary-600 dark:text-primary-500 hover:underline">Theo dõi</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Shipments;