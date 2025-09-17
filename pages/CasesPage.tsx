import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Case, CaseStatus, CasePriority, UserRole } from '../types';
import { getCases, deleteCase } from '../services/mockApi';
import Button from '../components/ui/Button';
import { PlusIcon, EditIcon, TrashIcon } from '../components/icons/Icons';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/ui/Modal';
import CaseForm from '../components/cases/CaseForm';

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
        case CasePriority.CRITICAL: return 'bg-red-500';
        case CasePriority.HIGH: return 'bg-orange-500';
        case CasePriority.MEDIUM: return 'bg-yellow-500';
        case CasePriority.LOW: return 'bg-blue-500';
        default: return 'bg-gray-500';
    }
};

const CasesPage: React.FC = () => {
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCase, setEditingCase] = useState<Case | null>(null);
    const { user } = useAuth();

    const fetchCases = async () => {
        setLoading(true);
        const data = await getCases();
        setCases(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCases();
    }, []);

    const handleOpenModal = (caseToEdit: Case | null = null) => {
        setEditingCase(caseToEdit);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCase(null);
    };

    const handleSave = () => {
        fetchCases();
        handleCloseModal();
    };

    const handleDelete = async (caseId: number) => {
        if (window.confirm('Are you sure you want to delete this case?')) {
            try {
                await deleteCase(caseId);
                fetchCases();
            } catch (error) {
                console.error("Failed to delete case", error);
                alert("Could not delete case.");
            }
        }
    };

    const canManageCases = user?.role === UserRole.ADMIN || user?.role === UserRole.INVESTIGATOR;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Case Management</h2>
                {canManageCases && (
                    <Button onClick={() => handleOpenModal()} leftIcon={<PlusIcon />}>
                        New Case
                    </Button>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Case ID</th>
                                <th scope="col" className="px-6 py-3">Title</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Priority</th>
                                <th scope="col" className="px-6 py-3">Created On</th>
                                <th scope="col" className="px-6 py-3">Assigned To</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="text-center p-8">Loading cases...</td></tr>
                            ) : (
                                cases.map(c => (
                                    <tr key={c.case_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{c.case_id}</td>
                                        <td className="px-6 py-4">{c.title}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(c.status)}`}>
                                                {c.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center">
                                                <span className={`h-2.5 w-2.5 rounded-full mr-2 ${getPriorityColor(c.priority)}`}></span>
                                                {c.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{new Date(c.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">User #{c.assigned_to}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link to={`/cases/${c.case_id}`} className="font-medium text-primary-600 dark:text-primary-500 hover:underline">View</Link>
                                                {canManageCases && (
                                                    <>
                                                        <button onClick={() => handleOpenModal(c)} className="p-1 text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-300">
                                                            <EditIcon className="w-5 h-5" />
                                                        </button>
                                                        <button onClick={() => handleDelete(c.case_id)} className="p-1 text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-300">
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                 <Modal title={editingCase ? "Edit Case" : "Create New Case"} isOpen={isModalOpen} onClose={handleCloseModal}>
                    <CaseForm
                        initialData={editingCase}
                        onSave={handleSave}
                        onCancel={handleCloseModal}
                    />
                </Modal>
            )}
        </div>
    );
};

export default CasesPage;