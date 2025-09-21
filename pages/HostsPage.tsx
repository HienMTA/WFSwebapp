import React, { useState, useEffect } from 'react';
// FIX: Import Host type from the central types.ts file.
import { getHosts } from '../services/mockApi';
import { Host } from '../types';

const getStatusColor = (status: Host['status']) => {
    switch (status) {
        case 'ONLINE': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case 'OFFLINE': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        default: return 'bg-gray-100 text-gray-800';
    }
};


const HostsPage: React.FC = () => {
    const [hosts, setHosts] = useState<Host[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHosts = async () => {
            setLoading(true);
            const data = await getHosts();
            setHosts(data);
            setLoading(false);
        };
        fetchHosts();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Host Management</h2>
                {/* Future button for adding agents
                <Button leftIcon={<PlusIcon />}>
                    Deploy Agent
                </Button> 
                */}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Hostname</th>
                                <th scope="col" className="px-6 py-3">IP Address</th>
                                <th scope="col" className="px-6 py-3">Operating System</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Last Seen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center p-8">Loading hosts...</td></tr>
                            ) : (
                                hosts.map(host => (
                                    <tr key={host.host_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{host.hostname}</td>
                                        <td className="px-6 py-4">{host.ip_address}</td>
                                        <td className="px-6 py-4">{host.os}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(host.status)}`}>
                                                {host.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{new Date(host.last_seen).toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HostsPage;