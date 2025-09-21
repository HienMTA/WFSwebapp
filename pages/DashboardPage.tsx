import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import SummaryChart from '../components/charts/SummaryChart';
import { getDashboardData } from '../services/mockApi';
import { Case, CaseLog, CaseStatus, CasePriority } from '../types';
import { useAuth } from '../context/AuthContext';
import { CaseIcon, ExclamationTriangleIcon, PlusCircleIcon, PencilSquareIcon, ArrowDownTrayIcon, DocumentPlusIcon } from '../components/icons/Icons';

interface DashboardStats {
  totalCases: number;
  openCases: number;
  inProgressCases: number;
  highPriorityCases: number;
  allCases: Case[];
  recentLogs: (CaseLog & { userName: string })[];
}

const getPriorityColor = (priority: CasePriority) => {
    switch (priority) {
        case CasePriority.CRITICAL: return 'bg-red-500';
        case CasePriority.HIGH: return 'bg-orange-500';
        case CasePriority.MEDIUM: return 'bg-yellow-500';
        case CasePriority.LOW: return 'bg-blue-500';
        default: return 'bg-gray-500';
    }
};

const getActivityIcon = (action: string) => {
    if (action.includes('CREATED')) return <PlusCircleIcon className="w-5 h-5 text-white" />;
    if (action.includes('UPDATED')) return <PencilSquareIcon className="w-5 h-5 text-white" />;
    if (action.includes('COLLECTION')) return <ArrowDownTrayIcon className="w-5 h-5 text-white" />;
    if (action.includes('ARTEFACT')) return <DocumentPlusIcon className="w-5 h-5 text-white" />;
    return <div className="w-5 h-5"></div>;
};

const getActivityIconBgColor = (action: string) => {
    if (action.includes('CREATED')) return 'bg-green-500';
    if (action.includes('UPDATED')) return 'bg-yellow-500';
    if (action.includes('COLLECTION')) return 'bg-blue-500';
    if (action.includes('ARTEFACT')) return 'bg-purple-500';
    return 'bg-gray-500';
}


function formatDistanceToNow(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
        const years = Math.floor(interval);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        const months = Math.floor(interval);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 86400;
    if (interval > 1) {
        const days = Math.floor(interval);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 3600;
    if (interval > 1) {
        const hours = Math.floor(interval);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 60;
    if (interval > 1) {
        const minutes = Math.floor(interval);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    return "just now";
}

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const data = await getDashboardData();
            setStats(data);
            setLoading(false);
        };
        fetchStats();
    }, []);

    const myOpenCases = stats?.allCases.filter(c => 
        c.assigned_to === user?.user_id && c.status !== CaseStatus.CLOSED
    ) || [];

    if (loading) {
        return <div className="text-center p-8">Loading dashboard...</div>;
    }
    
    if (!stats) {
        return <div className="text-center p-8">Could not load dashboard data.</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card title="Total Cases" value={stats.totalCases} icon={<CaseIcon className="w-8 h-8"/>} colorClass="bg-blue-500" />
                <Card title="Open Cases" value={stats.openCases} icon={<CaseIcon className="w-8 h-8"/>} colorClass="bg-green-500" />
                <Card title="In Progress" value={stats.inProgressCases} icon={<CaseIcon className="w-8 h-8"/>} colorClass="bg-yellow-500" />
                <Card title="High Priority" value={stats.highPriorityCases} icon={<ExclamationTriangleIcon className="w-8 h-8"/>} colorClass="bg-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* My Open Cases */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">My Open Cases</h3>
                        <div className="overflow-x-auto">
                           <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">Title</th>
                                        <th scope="col" className="px-4 py-3">Priority</th>
                                        <th scope="col" className="px-4 py-3">Last Updated</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myOpenCases.length > 0 ? myOpenCases.map(c => (
                                        <tr key={c.case_id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                                <Link to={`/cases/${c.case_id}`} className="hover:underline text-primary-600 dark:text-primary-400">
                                                    #{c.case_id} - {c.title}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="flex items-center">
                                                    <span className={`h-2.5 w-2.5 rounded-full mr-2 ${getPriorityColor(c.priority)}`}></span>
                                                    {c.priority}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">{formatDistanceToNow(c.updated_at)}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={3} className="text-center p-4 text-gray-500">You have no open cases assigned.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <SummaryChart cases={stats.allCases} />
                </div>
                
                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Recent Activity</h3>
                    <div className="relative">
                         <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></div>
                        <ul className="space-y-8">
                            {stats.recentLogs.map((log) => (
                                <li key={log.log_id} className="relative flex items-start">
                                    <div className={`absolute left-0 flex items-center justify-center w-8 h-8 rounded-full ${getActivityIconBgColor(log.action)}`}>
                                        {getActivityIcon(log.action)}
                                    </div>
                                    <div className="ml-12">
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            <span className="font-semibold text-gray-800 dark:text-gray-100">{log.userName}</span> {log.details.split(log.userName)[1] || log.details}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatDistanceToNow(log.timestamp)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;