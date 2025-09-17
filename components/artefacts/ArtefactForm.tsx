import React, { useState } from 'react';
import { createArtefact } from '../../services/mockApi';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface ArtefactFormProps {
  caseId: number;
  onSave: () => void;
  onCancel: () => void;
}

const ArtefactForm: React.FC<ArtefactFormProps> = ({ caseId, onSave, onCancel }) => {
    const { user: currentUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        evidence_type: 'File',
        file_size: 0,
        mime_type: 'application/octet-stream',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value, 10) || 0 : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || formData.file_size <= 0) {
            setError("Artefact name and a valid file size are required.");
            return;
        }
        if (!currentUser) {
            setError("You must be logged in to add an artefact.");
            return;
        }
        setLoading(true);
        setError('');

        try {
            await createArtefact({
                ...formData,
                case_id: caseId,
                collected_by: currentUser.user_id,
            });
            onSave();
        } catch (err) {
            setError('Failed to save artefact. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Artefact Name / File Name</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="evidence_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Evidence Type</label>
            <input type="text" name="evidence_type" id="evidence_type" value={formData.evidence_type} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div>
            <label htmlFor="file_size" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Size (Bytes)</label>
            <input type="number" name="file_size" id="file_size" value={formData.file_size} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
          </div>
      </div>
       <div>
            <label htmlFor="mime_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">MIME Type</label>
            <input type="text" name="mime_type" id="mime_type" value={formData.mime_type} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
        </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Add Artefact'}</Button>
      </div>
    </form>
  );
};

export default ArtefactForm;