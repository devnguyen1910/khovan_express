import React, { useEffect, useState, Fragment } from 'react';
import { getInventoryItems } from '../services/mockDataService';
import { generateInventorySummary } from '../services/geminiService';
import { InventoryItem } from '../types';

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getInventoryItems();
      setItems(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedItem(null);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleGenerateSummary = async () => {
    setIsSummaryLoading(true);
    setSummary('');
    const result = await generateInventorySummary(items);
    setSummary(result);
    setIsSummaryLoading(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p>Đang tải danh sách sản phẩm...</p></div>;
  }

  return (
    <Fragment>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Tồn kho ({items.length} sản phẩm)</h2>
          <div className="space-x-2">
              <button 
                  onClick={handleGenerateSummary}
                  disabled={isSummaryLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center"
              >
                  {isSummaryLoading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                      <path fillRule="evenodd" d="M10 2.5c-4.142 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5 7.5-3.358 7.5-7.5-3.358-7.5-7.5-7.5Zm-.813 4.042a.75.75 0 0 1 1.626 0l1.625 3.25a.75.75 0 0 1-.585.958 5.69 5.69 0 0 1-2.251.445 5.69 5.69 0 0 1-2.251-.445.75.75 0 0 1-.585-.958l1.625-3.25ZM10 14a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5A.75.75 0 0 1 10 14Z" clipRule="evenodd" />
                    </svg>
                  )}
                  {isSummaryLoading ? 'Đang xử lý...' : 'Tóm tắt bằng AI'}
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">Thêm sản phẩm</button>
          </div>
        </div>
        
        {summary && (
          <div className="bg-slate-200/50 dark:bg-slate-800 p-4 rounded-lg border border-slate-300 dark:border-slate-700">
              <h4 className="font-bold text-lg mb-2 text-indigo-500 dark:text-indigo-400">Báo cáo tóm tắt từ AI</h4>
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">{summary}</div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
              <tr>
                <th scope="col" className="px-6 py-3">Sản phẩm</th>
                <th scope="col" className="px-6 py-3">Mã SKU</th>
                <th scope="col" className="px-6 py-3">Số lượng</th>
                <th scope="col" className="px-6 py-3">Vị trí kho</th>
                <th scope="col" className="px-6 py-3">Nhà cung cấp</th>
                <th scope="col" className="px-6 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const stockLevel = item.quantity < 10 ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' : item.quantity < 50 ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400' : 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400';
                return (
                <tr key={item.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap flex items-center">
                    <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-md mr-4 object-cover" />
                    <span className="text-slate-800 dark:text-slate-100">{item.name}</span>
                  </th>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{item.sku}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stockLevel}`}>
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{item.location}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{item.supplier}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setSelectedItem(item)} className="font-medium text-primary-600 dark:text-primary-500 hover:underline">Xem chi tiết</button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full m-4 transform transition-all animate-fade-in-scale"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
              <h3 id="modal-title" className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Chi tiết sản phẩm
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                aria-label="Đóng"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-center">
                <img
                  src={selectedItem.imageUrl.replace('/200/200', '/400/300')}
                  alt={selectedItem.name}
                  className="rounded-lg object-cover max-h-64 w-full"
                />
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">{selectedItem.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Mã SKU:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{selectedItem.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Số lượng:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedItem.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Vị trí kho:</span>
                    <span className="text-slate-700 dark:text-slate-300">{selectedItem.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Nhà cung cấp:</span>
                    <span className="text-slate-700 dark:text-slate-300">{selectedItem.supplier}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Inventory;