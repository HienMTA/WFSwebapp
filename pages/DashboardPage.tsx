
import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import SummaryChart from '../components/charts/SummaryChart';
import { getDashboardStats } from '../services/mockApi';
import { CaseIcon, UsersIcon } from '../components/icons/Icons';

interface DashboardStats {
  totalCases: number;
  openCases: number;
  inProgressCases: number;
  totalUsers: number;
  recentActivity: { user: string; action: string; time: string }[];
}

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const data = await getDashboardStats();
            setStats(data);
            setLoading(false);
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="text-center p-8">Loading dashboard...</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card title="Total Cases" value={stats?.totalCases || 0} icon={<CaseIcon className="w-8 h-8"/>} colorClass="bg-blue-500" />
                <Card title="Open Cases" value={stats?.openCases || 0} icon={<CaseIcon className="w-8 h-8"/>} colorClass="bg-green-500" />
                <Card title="In Progress" value={stats?.inProgressCases || 0} icon={<CaseIcon className="w-8 h-8"/>} colorClass="bg-yellow-500" />
                <Card title="Total Users" value={stats?.totalUsers || 0} icon={<UsersIcon className="w-8 h-8"/>} colorClass="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SummaryChart />
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Recent Activity</h3>
                    <ul className="space-y-4">
                        {stats?.recentActivity.map((activity, index) => (
                            <li key={index} className="flex items-start">
                                <div className="flex-shrink-0 h-2.5 w-2.5 rounded-full bg-primary-500 mt-2 mr-3"></div>
                                <div>
                                    <p className="text-sm">
                                        <span className="font-semibold">{activity.user}</span> {activity.action}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
