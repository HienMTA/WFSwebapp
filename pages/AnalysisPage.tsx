import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalysisIcon } from '../components/icons/Icons';
import AnalysisSelectionModal from '../components/analysis/AnalysisSelectionModal';

const tools = [
  { name: 'File System Analysis', description: 'Recover deleted files and analyze metadata.', path: '/analysis/file-system', enabled: true },
  { name: 'Memory Analysis', description: 'Volatility 3 integration for memory dumps.', path: '#', enabled: false },
  { name: 'Registry Analysis', description: 'Parse hives and track user activity.', path: '#', enabled: false },
  { name: 'Browser Forensics', description: 'Analyze history, cache, and cookies.', path: '#', enabled: false },
  { name: 'Metadata Extraction', description: 'Extract EXIF and document properties.', path: '#', enabled: false },
  { name: 'Event Log Viewer', description: 'Parse and analyze Windows Event Logs.', path: '#', enabled: false },
];

interface SelectedTool {
  name: string;
  path: string;
}

const AnalysisPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<SelectedTool | null>(null);
  const navigate = useNavigate();

  const handleToolClick = (tool: (typeof tools)[0]) => {
    if (tool.enabled) {
      setSelectedTool({ name: tool.name, path: tool.path });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTool(null);
  };

  const handleStartAnalysis = (caseId: string, artefactId: string) => {
    if (selectedTool) {
      navigate(selectedTool.path, { state: { caseId, artefactId } });
    }
    handleCloseModal();
  };


  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Analysis Tools</h2>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        Select a tool to begin your analysis. Upload an artefact or select an existing one from a case to get started.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
           <div
            key={tool.name}
            onClick={() => handleToolClick(tool)}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-full flex flex-col ${
              tool.enabled
                ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500'
                : 'opacity-50 cursor-not-allowed'
            }`}
            role={tool.enabled ? 'button' : undefined}
            tabIndex={tool.enabled ? 0 : -1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleToolClick(tool);
              }
            }}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full mr-4">
                <AnalysisIcon className="w-6 h-6 text-primary-600 dark:text-primary-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{tool.name}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{tool.description}</p>
          </div>
        ))}
      </div>
      {selectedTool && (
        <AnalysisSelectionModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onStart={handleStartAnalysis}
            toolName={selectedTool.name}
        />
      )}
    </div>
  );
};

export default AnalysisPage;