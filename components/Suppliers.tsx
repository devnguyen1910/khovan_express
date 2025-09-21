import React, { useEffect, useState } from 'react';
import { getSuppliers, getInventoryItems } from '../services/apiService';
import { generateSupplierSuggestions } from '../services/geminiService';
import { Supplier, InventoryItem, SupplierSuggestion } from '../types';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => (
                <svg key={`full-${i}`} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
            {halfStar && (
                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <svg key={`empty-${i}`} className="w-4 h-4 text-slate-300 dark:text-slate-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
        </div>
    );
};


const Suppliers: React.FC = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [suggestions, setSuggestions] = useState<SupplierSuggestion[] | null>(null);
    const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
    const [suggestionError, setSuggestionError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [suppliersData, inventoryData] = await Promise.all([getSuppliers(), getInventoryItems()]);
            const sortedSuppliers = suppliersData.sort((a, b) => b.rating - a.rating);
            setSuppliers(sortedSuppliers);
            setInventory(inventoryData);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleGenerateSuggestions = async () => {
        setIsSuggestionLoading(true);
        setSuggestions(null);
        setSuggestionError(null);
        const result = await generateSupplierSuggestions(suppliers, inventory);
        if (result && 'error' in result) {
            setSuggestionError(result.error);
        } else if (result) {
            setSuggestions(result as SupplierSuggestion[]);
        }
        setIsSuggestionLoading(false);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full"><p>Đang tải danh sách nhà cung cấp...</p></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Nhà cung cấp ({suppliers.length})</h2>
                 <div className="flex items-center space-x-2">
                    <button
                        onClick={handleGenerateSuggestions}
                        disabled={isSuggestionLoading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center"
                    >
                        {isSuggestionLoading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                                <path fillRule="evenodd" d="M10 2.5c-4.142 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5 7.5-3.358 7.5-7.5-3.358-7.5-7.5-7.5Zm-.813 4.042a.75.75 0 0 1 1.626 0l1.625 3.25a.75.75 0 0 1-.585.958 5.69 5.69 0 0 1-2.251.445 5.69 5.69 0 0 1-2.251-.445.75.75 0 0 1-.585-.958l1.625-3.25ZM10 14a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5A.75.75 0 0 1 10 14Z" clipRule="evenodd" />
                            </svg>
                        )}
                        {isSuggestionLoading ? 'Đang phân tích...' : 'Gợi ý nhà cung cấp AI'}
                    </button>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">Thêm nhà cung cấp</button>
                </div>
            </div>

            {(suggestions || suggestionError) && (
                <div className="relative bg-slate-200/50 dark:bg-slate-800 p-4 rounded-lg border border-slate-300 dark:border-slate-700 animate-fade-in-scale">
                    <button onClick={() => { setSuggestions(null); setSuggestionError(null); }} className="absolute top-2 right-2 p-1 rounded-full text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700" aria-label="Đóng">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <h4 className="font-bold text-lg mb-2 text-indigo-500 dark:text-indigo-400">Gợi ý nhà cung cấp từ AI</h4>
                    {suggestionError ? (
                        <p className="text-red-500">{suggestionError}</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {suggestions?.map((s, index) => (
                                <div key={index} className="bg-white dark:bg-slate-700/50 p-4 rounded-lg shadow">
                                    <h5 className="font-bold text-slate-800 dark:text-slate-100">{s.name}</h5>
                                    <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mt-1">{s.specialty}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{s.reason}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">Tên nhà cung cấp</th>
                            <th scope="col" className="px-6 py-3">Người liên hệ</th>
                            <th scope="col" className="px-6 py-3">Email / Số điện thoại</th>
                            <th scope="col" className="px-6 py-3">Sản phẩm cung cấp</th>
                            <th scope="col" className="px-6 py-3">Đánh giá</th>
                            <th scope="col" className="px-6 py-3 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map((supplier) => (
                            <tr key={supplier.id} className={`border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200 ${supplier.rating >= 4 ? 'border-l-4 border-l-amber-400 bg-amber-50/50 dark:bg-amber-900/20' : 'border-l-4 border-l-transparent'}`}>
                                <th scope="row" className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                                    {supplier.name}
                                    {supplier.rating === 5 && (
                                        <span title="Nhà cung cấp hàng đầu" className="ml-2 text-amber-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 inline-block align-text-bottom">
                                                <path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.415-.772 1.736 0l1.291 3.118c.241.58.765 1.003 1.393 1.06l3.39.493c.85.124 1.187 1.17.558 1.76l-2.454 2.393a1.423 1.423 0 00-.412 1.265l.579 3.375c.145.845-.733 1.502-1.485 1.09L10.5 15.54a1.423 1.423 0 00-1.332 0l-3.03 1.815c-.752.412-1.63-.245-1.485-1.09l.579-3.375a1.423 1.423 0 00-.412-1.265L2.31 9.388c-.629-.59-.292-1.636.558-1.76l3.39-.493a1.423 1.423 0 001.393-1.06l1.29-3.118Z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    )}
                                </th>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{supplier.contactPerson}</td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                    <div>{supplier.email}</div>
                                    <div className="font-mono">{supplier.phone}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-center">{supplier.productsSupplied}</td>
                                <td className="px-6 py-4">
                                    <StarRating rating={supplier.rating} />
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 dark:bg-primary-900/50 dark:text-primary-300 dark:hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-slate-800 focus:ring-primary-500 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path>
                                        </svg>
                                        Sửa
                                    </button>
                                    <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-slate-800 focus:ring-red-500 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Suppliers;