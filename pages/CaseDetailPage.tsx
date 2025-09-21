import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
// FIX: Consolidate type imports to the central types.ts file.
import { Case, Artefact, CaseStatus, CasePriority, User, UserRole, CollectionJob, CaseLog } from '../types';
import { getCaseById, getArtefactsForCase, getUsers, getCollectionJobsForCase, getLogsForCase } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { PlusIcon, PlusCircleIcon, PencilSquareIcon, ArrowDownTrayIcon, DocumentPlusIcon } from '../components/icons/Icons';
import ArtefactForm from '../components/artefacts/ArtefactForm';
import CollectionWizardModal from '../components/collection/CollectionWizardModal';

const getStatusColor = (status: CaseStatus) => {
    switch (status) {
        case CaseStatus.OPEN: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case CaseStatus.IN_PROGRESS: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        case CaseStatus.CLOSED: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getPriorityColor = (priority: CasePriority) => {
     switch (priority) {
        case CasePriority.CRITICAL: return 'text-red-500';
        case CasePriority.HIGH: return 'text-orange-500';
        case CasePriority.MEDIUM: return 'text-yellow-500';
        case CasePriority.LOW: return 'text-blue-500';
        default: return 'text-gray-500';
    }
};

const getJobStatusColor = (status: CollectionJob['status']) => {
    switch (status) {
        case 'COMPLETED': return 'bg-green-100 text-green-800';
        case 'RUNNING': return 'bg-blue-100 text-blue-800';
        case 'PENDING': return 'bg-yellow-100 text-yellow-800';
        case 'FAILED': return 'bg-red-100 text-red-800';
    }
}

const getActivityIcon = (action: string) => {
    if (action.includes('CREATED')) return <PlusCircleIcon className="w-5 h-5 text-green-500" />;
    if (action.includes('UPDATED')) return <PencilSquareIcon className="w-5 h-5 text-yellow-500" />;
    if (action.includes('COLLECTION')) return <ArrowDownTrayIcon className="w-5 h-5 text-blue-500" />;
    if (action.includes('ARTEFACT')) return <DocumentPlusIcon className="w-5 h-5 text-purple-500" />;
    return <div className="w-5 h-5"></div>;
};

const CaseDetailPage: React.FC = () => {
    const { caseId } = useParams<{ caseId: string }>();
    const [caseData, setCaseData] = useState<Case | null>(null);
    const [artefacts, setArtefacts] = useState<Artefact[]>([]);
    const [collectionJobs, setCollectionJobs] = useState<CollectionJob[]>([]);
    const [logs, setLogs] = useState<CaseLog[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isArtefactModalOpen, setIsArtefactModalOpen] = useState(false);
    const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);

    const { user } = useAuth();

    const canManageArtefacts = user?.role === UserRole.ADMIN || user?.role === UserRole.INVESTIGATOR || user?.role === UserRole.ANALYST;
    const canCollectData = user?.role === UserRole.ADMIN || user?.role === UserRole.INVESTIGATOR;
    
    const fetchCaseData = useCallback(async () => {
        if (!caseId) return;
        try {
            const id = parseInt(caseId, 10);
            const [artefactsInfo, jobsInfo, logsInfo] = await Promise.all([
                getArtefactsForCase(id),
                getCollectionJobsForCase(id),
                getLogsForCase(id),
            ]);
            setArtefacts(artefactsInfo);
            setCollectionJobs(jobsInfo.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
            setLogs(logsInfo);
        } catch (error) {
            console.error("Failed to refresh case data:", error);
        }
    }, [caseId]);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (!caseId) return;
            setLoading(true);
            try {
                const id = parseInt(caseId, 10);
                const [caseInfo, usersInfo] = await Promise.all([
                    getCaseById(id),
                    getUsers(),
                ]);

                if (caseInfo) {
                    setCaseData(caseInfo);
                    setUsers(usersInfo);
                    await fetchCaseData();
                } else {
                     setCaseData(null);
                }
            } catch (error) {
                console.error("Failed to fetch case details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [caseId, fetchCaseData]);

    const getUserFullName = (userId: number) => {
        return users.find(u => u.user_id === userId)?.full_name || `User #${userId}`;
    }
    
    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    
    const handleSaveArtefact = () => {
        fetchCaseData();
        setIsArtefactModalOpen(false);
    };

    const handleCollectionStarted = () => {
        fetchCaseData(); // Refresh jobs list
        setIsCollectionModalOpen(false);
        // Poll for updates
        const interval = setInterval(() => {
            fetchCaseData();
        }, 5000);
        // Stop polling after a while
        setTimeout(() => clearInterval(interval), 60000);
    };


    if (loading) {
        return <div className="text-center p-8">Loading case details...</div>;
    }

    if (!caseData) {
        return (
             <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-4">Case Not Found</h2>
                <p>The case you are looking for does not exist.</p>
                <Link to="/cases" className="text-primary-500 hover:underline mt-4 inline-block">Return to Case List</Link>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <Link to="/cases" className="text-sm text-primary-500 hover:underline mb-2 block">&larr; Back to Cases</Link>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{caseData.title}</h2>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(caseData.status)}`}>
                            {caseData.status.replace('_', ' ')}
                        </span>
                        <span className={`font-bold ${getPriorityColor(caseData.priority)}`}>{caseData.priority}</span>
                        <span>Case #{caseData.case_id}</span>
                    </div>
                </div>
                {canCollectData && (
                    <Button onClick={() => setIsCollectionModalOpen(true)}>Collect Data</Button>
                )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Case Description</h3>
                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{caseData.description}</p>
                    </div>

                    {/* NEW: Case Activity Log */}
                     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Case Activity Log</h3>
                        <div className="relative pl-6">
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                             <ul className="space-y-6">
                                {logs.map(log => (
                                    <li key={log.log_id} className="relative">
                                        <div className="absolute -left-[34px] top-0.5 flex items-center justify-center w-5 h-5 bg-white dark:bg-gray-800 rounded-full">
                                            {getActivityIcon(log.action)}
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm">
                                                <span className="font-semibold text-gray-900 dark:text-white">{getUserFullName(log.user_id)}</span>
                                                <span className="text-gray-600 dark:text-gray-400"> {log.details}</span>
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>


                    {/* Collection Jobs */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Collection Jobs ({collectionJobs.length})</h3>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Job ID</th>
                                        <th scope="col" className="px-6 py-3">Profile</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3">Created By</th>
                                        <th scope="col" className="px-6 py-3">Created At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {collectionJobs.map(job => (
                                        <tr key={job.job_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{job.job_id}</td>
                                            <td className="px-6 py-4">{job.profile}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getJobStatusColor(job.status)}`}>{job.status}</span>
                                            </td>
                                            <td className="px-6 py-4">{getUserFullName(job.created_by)}</td>
                                            <td className="px-6 py-4">{new Date(job.created_at).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    {collectionJobs.length === 0 && (
                                        <tr><td colSpan={5} className="text-center p-4 text-gray-500">No collection jobs for this case.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Artefacts */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <div className="p-6 flex justify-between items-center border-b dark:border-gray-700">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Artefacts ({artefacts.length})</h3>
                            {canManageArtefacts && (
                                <Button size="sm" onClick={() => setIsArtefactModalOpen(true)} leftIcon={<PlusIcon />}>
                                    Add Artefact
                                </Button>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Name</th>
                                        <th scope="col" className="px-6 py-3">Type</th>
                                        <th scope="col" className="px-6 py-3">Size</th>
                                        <th scope="col" className="px-6 py-3">Collected</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {artefacts.map(artefact => (
                                        <tr key={artefact.artefact_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{artefact.name}</td>
                                            <td className="px-6 py-4">{artefact.evidence_type}</td>
                                            <td className="px-6 py-4">{formatBytes(artefact.file_size)}</td>
                                            <td className="px-6 py-4">{new Date(artefact.collected_at).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                     {artefacts.length === 0 && (
                                        <tr><td colSpan={4} className="text-center p-4 text-gray-500">No artefacts for this case.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-fit">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Details</h3>
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</dt>
                            <dd className="mt-1 text-gray-900 dark:text-white">{getUserFullName(caseData.created_by)}</dd>
                        </div>
                         <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned To</dt>
                            <dd className="mt-1 text-gray-900 dark:text-white">{getUserFullName(caseData.assigned_to)}</dd>
                        </div>
                         <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date Created</dt>
                            <dd className="mt-1 text-gray-900 dark:text-white">{new Date(caseData.created_at).toLocaleString()}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                            <dd className="mt-1 text-gray-900 dark:text-white">{new Date(caseData.updated_at).toLocaleString()}</dd>
                        </div>
                    </dl>
                </div>
            </div>
            
            {isArtefactModalOpen && caseData && (
                 <Modal title="Add New Artefact" isOpen={isArtefactModalOpen} onClose={() => setIsArtefactModalOpen(false)}>
                    <ArtefactForm
                        caseId={caseData.case_id}
                        onSave={handleSaveArtefact}
                        onCancel={() => setIsArtefactModalOpen(false)}
                    />
                </Modal>
            )}

            {isCollectionModalOpen && caseData && (
                <Modal title="Start New Data Collection" isOpen={isCollectionModalOpen} onClose={() => setIsCollectionModalOpen(false)}>
                    <CollectionWizardModal
                        caseId={caseData.case_id}
                        onStart={handleCollectionStarted}
                        onCancel={() => setIsCollectionModalOpen(false)}
                    />
                </Modal>
            )}
        </div>
    );
};

export default CaseDetailPage;