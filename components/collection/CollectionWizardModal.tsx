import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { getHosts, startCollectionJob } from '../../services/mockApi';
import { Host } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface CollectionWizardModalProps {
  caseId: number;
  onStart: () => void;
  onCancel: () => void;
}

const collectionProfiles = [
    "Quick Triage (RAM, Processes, Network)",
    "Full Memory Dump",
    "Key System Files (Logs, Registry)",
    "Browser History",
    "Full Disk Image (C:)",
];

const CollectionWizardModal: React.FC<CollectionWizardModalProps> = ({ caseId, onStart, onCancel }) => {
  const { user } = useAuth();
  const [hosts, setHosts] = useState<Host[]>([]);
  const [selectedHostId, setSelectedHostId] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(collectionProfiles[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHosts = async () => {
      setLoading(true);
      try {
        const hostsData = await getHosts();
        setHosts(hostsData.filter(h => h.status === 'ONLINE'));
      } catch (err) {
        setError("Failed to load available hosts.");
      } finally {
        setLoading(false);
      }
    };
    loadHosts();
  }, []);

  const handleStartCollection = async () => {
      if (!selectedHostId || !selectedProfile) {
          setError("Please select a host and a collection profile.");
          return;
      }
      if (!user) {
          setError("Authentication error. Please log in again.");
          return;
      }
      setLoading(true);
      setError('');
      try {
          await startCollectionJob(caseId, parseInt(selectedHostId, 10), selectedProfile, user.user_id);
          onStart();
      } catch (err) {
          setError("Failed to start collection job.");
          console.error(err);
      } finally {
          setLoading(false);
      }
  };

  return (
      <div className="space-y-4">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div>
          <label htmlFor="host-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            1. Select Target Host (Online only)
          </label>
          <select
            id="host-select"
            value={selectedHostId}
            onChange={(e) => setSelectedHostId(e.target.value)}
            disabled={loading}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">{loading ? 'Loading hosts...' : 'Select a host'}</option>
            {hosts.map((h) => (
              <option key={h.host_id} value={h.host_id}>
                {h.hostname} ({h.ip_address})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="profile-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            2. Select Collection Profile
          </label>
          <select
            id="profile-select"
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
            disabled={loading}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
          >
            {collectionProfiles.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
            <Button onClick={handleStartCollection} disabled={loading || !selectedHostId}>
                {loading ? 'Starting...' : 'Start Collection'}
            </Button>
        </div>
      </div>
  );
};

export default CollectionWizardModal;