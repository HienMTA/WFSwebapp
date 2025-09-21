import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { getCases, getArtefactsForCase } from '../../services/mockApi';
import { Case, Artefact } from '../../types';

interface AnalysisSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (caseId: string, artefacts: Artefact[]) => void;
  toolName: string;
}

const AnalysisSelectionModal: React.FC<AnalysisSelectionModalProps> = ({ isOpen, onClose, onStart, toolName }) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [artefacts, setArtefacts] = useState<Artefact[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [selectedArtefactIds, setSelectedArtefactIds] = useState<Record<string, boolean>>({});
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
      setSelectedArtefactIds({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedCaseId) {
      const loadArtefacts = async () => {
        setLoadingArtefacts(true);
        setArtefacts([]);
        setSelectedArtefactIds({});
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
      setSelectedArtefactIds({});
    }
  }, [selectedCaseId]);

  const handleArtefactSelection = (artefactId: string) => {
    setSelectedArtefactIds(prev => ({
      ...prev,
      [artefactId]: !prev[artefactId],
    }));
  };

  const handleStart = () => {
    const selectedIds = Object.keys(selectedArtefactIds).filter(id => selectedArtefactIds[id]);
    const selectedArtefacts = artefacts.filter(a => selectedIds.includes(a.artefact_id.toString()));
    if (selectedCaseId && selectedArtefacts.length > 0) {
      onStart(selectedCaseId, selectedArtefacts);
    }
  };

  const hasSelectedArtefacts = Object.values(selectedArtefactIds).some(isSelected => isSelected);

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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            2. Select Artefact(s)
          </label>
          <div className="mt-1 max-h-48 overflow-y-auto rounded-md border border-gray-300 dark:border-gray-600 p-2 space-y-1 bg-white dark:bg-gray-700">
            {loadingArtefacts && <p className="text-sm text-gray-500">Loading artefacts...</p>}
            {!loadingArtefacts && artefacts.length === 0 && selectedCaseId && (
              <p className="text-sm text-gray-500">No artefacts found for this case.</p>
            )}
             {!selectedCaseId && (
              <p className="text-sm text-gray-500">Please select a case first.</p>
            )}
            {artefacts.map((artefact) => (
              <label key={artefact.artefact_id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!selectedArtefactIds[artefact.artefact_id]}
                  onChange={() => handleArtefactSelection(artefact.artefact_id.toString())}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-900 dark:text-gray-200">
                  {artefact.name} ({artefact.evidence_type})
                </span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={handleStart} disabled={!hasSelectedArtefacts}>Start Analysis</Button>
        </div>
      </div>
    </Modal>
  );
};

export default AnalysisSelectionModal;
