import React, { useState, useEffect } from 'react';
import { Case, CasePriority, CaseStatus, User } from '../../types';
import { createCase, updateCase, getUsers } from '../../services/mockApi';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface CaseFormProps {
  initialData: Case | null;
  onSave: () => void;
  onCancel: () => void;
}

const CaseForm: React.FC<CaseFormProps> = ({ initialData, onSave, onCancel }) => {
  const { user: currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || CaseStatus.OPEN,
    priority: initialData?.priority || CasePriority.MEDIUM,
    assigned_to: initialData?.assigned_to || 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const userList = await getUsers();
      setUsers(userList.filter(u => u.is_active));
      if (!initialData && userList.length > 0) {
        // Default to current user if possible, otherwise first active user
        const defaultAssignee = userList.find(u => u.user_id === currentUser?.user_id) || userList.find(u => u.is_active);
        if (defaultAssignee) {
           setFormData(prev => ({ ...prev, assigned_to: defaultAssignee.user_id }));
        }
      } else if (initialData) {
          setFormData(prev => ({ ...prev, assigned_to: initialData.assigned_to }));
      }
    };
    fetchUsers();
  }, [initialData, currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.assigned_to) {
        setError("Title and Assignee are required.");
        return;
    }
    setLoading(true);
    setError('');

    if (!currentUser) {
        setError("You must be logged in to save a case.");
        setLoading(false);
        return;
    }

    try {
        if (initialData) {
            // FIX: Pass the current user's ID as the required third argument to `updateCase`.
            await updateCase(initialData.case_id, formData, currentUser.user_id);
        } else {
            await createCase({ ...formData, created_by: currentUser.user_id }, currentUser.user_id);
        }
        onSave();
    } catch (err) {
        setError('Failed to save case. Please try again.');
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600">
            {Object.values(CaseStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
          <select name="priority" id="priority" value={formData.priority} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600">
            {Object.values(CasePriority).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assigned To</label>
        <select name="assigned_to" id="assigned_to" value={formData.assigned_to} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600">
          <option value={0} disabled>Select a user</option>
          {users.map(u => <option key={u.user_id} value={u.user_id}>{u.full_name}</option>)}
        </select>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Case'}</Button>
      </div>
    </form>
  );
};

export default CaseForm;