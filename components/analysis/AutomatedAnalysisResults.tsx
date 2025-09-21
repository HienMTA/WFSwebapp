import React, { useState } from 'react';
import { AutomatedAnalysisReport, AnalysisFinding } from '../../types';
import Button from '../ui/Button';
import { ChevronDownIcon, ChevronRightIcon } from '../icons/Icons';

interface AutomatedAnalysisResultsProps {
  report: AutomatedAnalysisReport;
  onSelectFinding: (finding: AnalysisFinding) => void;
  onBack: () => void;
}

const CategorySection: React.FC<{
    title: string;
    findings: AnalysisFinding[];
    onSelectFinding: (finding: AnalysisFinding) => void;
}> = ({ title, findings, onSelectFinding }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="border-b dark:border-gray-700">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                <h3 className="text-lg font-semibold">{title} ({findings.length})</h3>
                {isExpanded ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
            </button>
            {isExpanded && (
                <div className="divide-y dark:divide-gray-700">
                    {findings.map((finding, index) => (
                        <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer" onClick={() => onSelectFinding(finding)}>
                             <p className="font-semibold text-primary-600 dark:text-primary-400">{finding.value.name}</p>
                             <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{finding.description}</p>
                             <p className="font-mono text-xs text-gray-500 dark:text-gray-400" title={finding.path}>Path: {finding.path}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


const AutomatedAnalysisResults: React.FC<AutomatedAnalysisResultsProps> = ({ report, onSelectFinding, onBack }) => {
  const categories = Object.keys(report);

  return (
    <div className="flex-grow flex flex-col border dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 sticky top-0 z-10">
             <h2 className="text-xl font-bold">Automated Analysis Report</h2>
             <Button onClick={onBack} variant="secondary">Back to Browser</Button>
        </div>
        <div className="flex-grow overflow-y-auto">
            {categories.length > 0 ? (
                categories.map(category => (
                    <CategorySection
                        key={category}
                        title={category}
                        findings={report[category]}
                        onSelectFinding={onSelectFinding}
                    />
                ))
            ) : (
                <div className="p-8 text-center text-gray-500">
                    <h3 className="text-lg font-semibold">No Findings</h3>
                    <p>The automated scan did not find any common forensic artifacts in this hive.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default AutomatedAnalysisResults;
