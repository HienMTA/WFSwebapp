import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getRegistryHiveData } from '../services/mockApi';
import { RegistryHive, RegistryKey, RegistryValue, Artefact, AutomatedAnalysisReport, AnalysisFinding } from '../types';
import RegistryTree from '../components/analysis/RegistryTree';
import RegistryValueTable from '../components/analysis/RegistryValueTable';
import RegistryDataViewer from '../components/analysis/RegistryDataViewer';
import Button from '../components/ui/Button';
import { SparklesIcon } from '../components/icons/Icons';
import { runAutomatedAnalysis } from '../services/registryScanner';
import AutomatedAnalysisResults from '../components/analysis/AutomatedAnalysisResults';

type ViewMode = 'browser' | 'analysis';

const findKeyByPath = (key: RegistryKey, path: string): RegistryKey | null => {
    if (key.path === path) return key;
    for (const subkey of key.subkeys) {
        // FIX: Corrected typo from findKeyByyPath to findKeyByPath.
        const found = findKeyByPath(subkey, path);
        if (found) return found;
    }
    return null;
};

const RegistryAnalysisPage: React.FC = () => {
    const location = useLocation();
    const [hiveData, setHiveData] = useState<RegistryHive | null>(null);
    const [selectedKeyPath, setSelectedKeyPath] = useState<string>('');
    const [selectedKeyValue, setSelectedKeyValue] = useState<RegistryValue | null>(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<ViewMode>('browser');
    const [analysisReport, setAnalysisReport] = useState<AutomatedAnalysisReport | null>(null);

    const { caseId, artefacts } = (location.state || { caseId: 'N/A', artefacts: [] }) as { caseId: string, artefacts: Artefact[] };
    const [activeArtefact, setActiveArtefact] = useState<Artefact | null>(artefacts[0] || null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setView('browser');
            setAnalysisReport(null);
            const data = await getRegistryHiveData();
            setHiveData(data);
            setSelectedKeyPath(data.root.path);
            setLoading(false);
        };

        if (activeArtefact) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [activeArtefact]);

    const handleRunAnalysis = () => {
        if (hiveData) {
            const report = runAutomatedAnalysis(hiveData.root);
            setAnalysisReport(report);
            setView('analysis');
        }
    };

    const handleKeySelect = (path: string) => {
        setSelectedKeyPath(path);
        setSelectedKeyValue(null);
    };

    const handleValueSelect = (value: RegistryValue) => {
        setSelectedKeyValue(value);
    };

    const handleSelectFinding = (finding: AnalysisFinding) => {
        // Expand tree to the parent path and select the key
        const parentPath = finding.path;
        setSelectedKeyPath(parentPath);
        
        // Find the specific value and select it
        const key = findKeyByPath(hiveData!.root, parentPath);
        if (key) {
            const valueToSelect = key.values.find(v => v.name === finding.value.name && v.data === finding.value.data);
            if (valueToSelect) {
                setSelectedKeyValue(valueToSelect);
            }
        }
        
        setView('browser');
    };

    const selectedKey = hiveData ? findKeyByPath(hiveData.root, selectedKeyPath) : null;
    
    if (loading) {
        return <div className="text-center p-8">Loading Registry Hive...</div>;
    }

    if (!activeArtefact) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-4">No Artefact Selected</h2>
                <p>Please go back and select an artefact to analyze.</p>
                <Link to="/analysis" className="text-primary-500 hover:underline mt-4 inline-block">&larr; Back to Analysis Tools</Link>
            </div>
        );
    }
    
    if (!hiveData) {
        return <div className="text-center p-8">Could not load registry hive data for {activeArtefact.name}.</div>;
    }

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)]">
            <div className="mb-4">
                 <Link to="/analysis" className="text-sm text-primary-500 hover:underline mb-2 block">&larr; Back to Analysis Tools</Link>
                <div className="flex justify-between items-center">
                     <div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Registry Analysis</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Case #{caseId}</p>
                    </div>
                    <Button onClick={handleRunAnalysis} leftIcon={<SparklesIcon className="w-5 h-5"/>}>
                        Automated Analysis
                    </Button>
                </div>
            </div>
            
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                {artefacts.map(artefact => (
                    <button 
                        key={artefact.artefact_id}
                        onClick={() => setActiveArtefact(artefact)}
                        className={`px-4 py-2 text-sm font-medium border-b-2
                            ${activeArtefact?.artefact_id === artefact.artefact_id 
                                ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                            }`}
                    >
                        {artefact.name}
                    </button>
                ))}
            </div>

            {view === 'browser' && (
                <div className="flex-grow flex border dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                    <div className="w-1/3 border-r dark:border-gray-700 overflow-y-auto p-2">
                        <RegistryTree 
                            node={hiveData.root} 
                            onSelect={handleKeySelect}
                            selectedPath={selectedKeyPath}
                        />
                    </div>
                    
                    <div className="w-2/3 flex flex-col">
                        <div className="h-2/3 border-b dark:border-gray-700 overflow-hidden flex flex-col">
                            <div className="p-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                <p className="text-sm font-mono text-gray-600 dark:text-gray-400 truncate" title={selectedKeyPath}>{selectedKeyPath}</p>
                            </div>
                            <div className="flex-grow overflow-y-auto">
                                {selectedKey ? (
                                    <RegistryValueTable
                                        values={selectedKey.values} 
                                        onValueSelect={handleValueSelect}
                                        currentKeyPath={selectedKey.path}
                                    />
                                ) : (
                                    <div className="p-4 text-center text-gray-500">Select a key to view its values.</div>
                                )}
                            </div>
                        </div>

                        <div className="h-1/3 overflow-y-auto">
                           <RegistryDataViewer value={selectedKeyValue} />
                        </div>
                    </div>
                </div>
            )}

            {view === 'analysis' && analysisReport && (
                <AutomatedAnalysisResults report={analysisReport} onSelectFinding={handleSelectFinding} onBack={() => setView('browser')}/>
            )}
        </div>
    );
};

export default RegistryAnalysisPage;