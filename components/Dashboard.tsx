
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Card from './Card';
import { BoxIcon, TruckIcon } from '../constants';
import { getDashboardStats, getShipments } from '../services/apiService';
import { Shipment, ShipmentStatus } from '../types';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({ totalInventory: 0, inventoryValue: 0, shipmentsInProgress: 0, issues: 0 });
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [statsData, shipmentsData] = await Promise.all([getDashboardStats(), getShipments()]);
            setStats(statsData as any);
            setShipments(shipmentsData);
            setLoading(false);
        };
        fetchData();
    }, []);

    const shipmentStatusData = Object.values(ShipmentStatus).map(status => ({
        name: status,
        count: shipments.filter(s => s.status === status).length,
    }));
    
    const COLORS = {
        [ShipmentStatus.Pending]: '#f59e0b', // amber-500
        [ShipmentStatus.InTransit]: '#3b82f6', // blue-500
        [ShipmentStatus.Delivered]: '#22c55e', // green-500
        [ShipmentStatus.Cancelled]: '#64748b', // slate-500
        [ShipmentStatus.Delayed]: '#ef4444', // red-500
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full"><p>Đang tải dữ liệu...</p></div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <Card title="Tổng sản phẩm trong kho" value={stats.totalInventory.toLocaleString('vi-VN')} icon={<BoxIcon className="w-6 h-6" />} change="+5.2%" changeType="positive" />
                <Card title="Giá trị tồn kho (ước tính)" value={`${(stats.inventoryValue/1000000).toFixed(2)} Tr`} icon={<div className="font-bold text-xl">đ</div>} change="-1.8%" changeType="negative" />
                <Card title="Đang vận chuyển" value={stats.shipmentsInProgress} icon={<TruckIcon className="w-6 h-6" />} />
                <Card title="Lô hàng có vấn đề" value={stats.issues} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Hoạt động vận chuyển gần đây</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={shipmentStatusData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.2)" />
                            <XAxis dataKey="name" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }} />
                            <Bar dataKey="count" name="Số lượng" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Phân bổ trạng thái lô hàng</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={shipmentStatusData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {shipmentStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as ShipmentStatus]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
