
import React from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative';
}

const Card: React.FC<CardProps> = ({ title, value, icon, change, changeType }) => {
  const changeColor = changeType === 'positive' ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex items-start justify-between transition-all hover:shadow-lg hover:-translate-y-1">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value}</p>
        {change && (
          <div className={`mt-2 text-xs font-medium ${changeColor} flex items-center`}>
            {changeType === 'positive' ? '▲' : '▼'} {change}
          </div>
        )}
      </div>
      <div className="bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 p-3 rounded-full">
        {icon}
      </div>
    </div>
  );
};

export default Card;
