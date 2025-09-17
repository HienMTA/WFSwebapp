import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { getUsers, deleteUser } from '../services/mockApi';
import Button from '../components/ui/Button';
import { PlusIcon, EditIcon, TrashIcon } from '../components/icons/Icons';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/ui/Modal';
import UserForm from '../components/users/UserForm';

const getRoleColor = (role: UserRole) => {
    switch (role) {
        case UserRole.ADMIN: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        case UserRole.INVESTIGATOR: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        case UserRole.ANALYST: return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
        case UserRole.VIEWER: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const { user: currentUser } = useAuth();

    const fetchUsers = async () => {
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenModal = (userToEdit: User | null = null) => {
        setEditingUser(userToEdit);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSave = () => {
        fetchUsers();
        handleCloseModal();
    };

    const handleDelete = async (userId: number) => {
        if (userId === currentUser?.user_id) {
            alert("You cannot delete your own account.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
                fetchUsers();
            } catch (error) {
                console.error("Failed to delete user", error);
                alert("Could not delete user.");
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">User Management</h2>
                {currentUser?.role === UserRole.ADMIN && (
                    <Button onClick={() => handleOpenModal()} leftIcon={<PlusIcon />}>
                        New User
                    </Button>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Full Name</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Role</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Last Login</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center p-8">Loading users...</td></tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.user_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{user.full_name}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button onClick={() => handleOpenModal(user)} className="p-1 text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-300">
                                                    <EditIcon className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleDelete(user.user_id)} className="p-1 text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-300">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
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
                <Modal title={editingUser ? "Edit User" : "Create New User"} isOpen={isModalOpen} onClose={handleCloseModal}>
                    <UserForm
                        initialData={editingUser}
                        onSave={handleSave}
                        onCancel={handleCloseModal}
                    />
                </Modal>
            )}
        </div>
    );
};

export default UsersPage;