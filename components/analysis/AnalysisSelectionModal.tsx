import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { getCases, getArtefactsForCase } from '../../services/mockApi';
import { Case, Artefact } from '../../types';

interface AnalysisSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (caseId: string, artefactId: string) => void;
  toolName: string;
}

const AnalysisSelectionModal: React.FC<AnalysisSelectionModalProps> = ({ isOpen, onClose, onStart, toolName }) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [artefacts, setArtefacts] = useState<Artefact[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [selectedArtefactId, setSelectedArtefactId] = useState('');
  const [loadingCases, setLoadingCases] = useState(true);
  const [loadingArtefacts, setLoadingArtefacts] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loadCases = async () => {
        setLoadingCases(true);
        try {
          const casesData = await getCases();
          setCases(casesData.filter(c => c.status !== 'CLOSED')); // Only show open/in-progress cases
        } catch (error) {
          console.error("Failed to load cases", error);
        } finally {
          setLoadingCases(false);
        }
      };
      loadCases();
    } else {
      // Reset state on close
      setCases([]);
      setArtefacts([]);
      setSelectedCaseId('');
      setSelectedArtefactId('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedCaseId) {
      const loadArtefacts = async () => {
        setLoadingArtefacts(true);
        setArtefacts([]);
        setSelectedArtefactId('');
        try {
          const artefactsData = await getArtefactsForCase(parseInt(selectedCaseId, 10));
          setArtefacts(artefactsData);
        } catch (error) {
          console.error("Failed to load artefacts", error);
        } finally {
          setLoadingArtefacts(false);
        }
      };
      loadArtefacts();
    } else {
      setArtefacts([]);
      setSelectedArtefactId('');
    }
  }, [selectedCaseId]);

  const handleStart = () => {
    if (selectedCaseId && selectedArtefactId) {
      onStart(selectedCaseId, selectedArtefactId);
    }
  };

  return (
    <Modal title={`Start ${toolName}`} isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label htmlFor="case-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            1. Select a Case
          </label>
          <select
            id="case-select"
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            disabled={loadingCases}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">{loadingCases ? 'Loading cases...' : 'Select a case'}</option>
            {cases.map((c) => (
              <option key={c.case_id} value={c.case_id}>
                #{c.case_id} - {c.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="artefact-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            2. Select an Artefact
          </label>
          <select
            id="artefact-select"
            value={selectedArtefactId}
            onChange={(e) => setSelectedArtefactId(e.target.value)}
            disabled={!selectedCaseId || loadingArtefacts}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">
              {loadingArtefacts ? 'Loading artefacts...' : (artefacts.length > 0 ? 'Select an artefact' : 'No artefacts found')}
            </option>
            {artefacts.map((a) => (
              <option key={a.artefact_id} value={a.artefact_id}>
                {a.name} ({a.evidence_type})
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={handleStart} disabled={!selectedArtefactId}>Start Analysis</Button>
        </div>
      </div>
    </Modal>
  );
};

export default AnalysisSelectionModal;