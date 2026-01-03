import React from 'react';
import { Users, Activity, CreditCard, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon, color }) => {
    const StatIcon = icon;
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md hover:border-blue-100 transition-all duration-300 group shadow-sm">
            <div className="flex items-start justify-between text-gray-700">
                <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
                    <p className={`text-xs font-medium ${subtext.startsWith('+') ? 'text-green-600' : 'text-gray-500'}`}>
                        {subtext}
                    </p>
                </div>
                <div className={`p-3 rounded-xl bg-opacity-10 ${color} group-hover:scale-105 transition-transform duration-300`}>
                    <StatIcon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const stats = [
        { title: 'Total Patients Today', value: '24', subtext: '+12% from yesterday', icon: Users, color: 'bg-blue-100 text-blue-600' },
        { title: 'Pending Reports', value: '8', subtext: 'Updated 5 mins ago', icon: Activity, color: 'bg-amber-100 text-amber-600' },
        { title: 'Today\'s Revenue', value: '₹ 12,450', subtext: '+8% vs last week', icon: CreditCard, color: 'bg-green-100 text-green-600' },
        { title: 'Sample Collection', value: '45', subtext: '32 In-lab, 13 Home', icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
    ];

    return (
        <div className="p-10 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-500">Welcome back, Dr. Kumar. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Placeholder for Charts/Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-6 h-96 flex items-center justify-center text-gray-400 shadow-sm">
                    [Chart Placeholder: Revenue Trend]
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-6 h-96 flex items-center justify-center text-gray-400 shadow-sm">
                    [List Placeholder: Recent Patients]
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
