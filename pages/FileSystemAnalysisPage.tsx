import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFileSystemData } from '../services/mockApi';
import { FileSystemNode } from '../types';
import FileTree from '../components/analysis/FileTree';
import FileTable from '../components/analysis/FileTable';
import FilePreview from '../components/analysis/FilePreview';

const findNodeByPath = (node: FileSystemNode, path: string): FileSystemNode | null => {
    if (node.path === path) return node;
    if (node.children) {
        for (const child of node.children) {
            const found = findNodeByPath(child, path);
            if (found) return found;
        }
    }
    return null;
};

const FileSystemAnalysisPage: React.FC = () => {
    const [treeData, setTreeData] = useState<FileSystemNode | null>(null);
    const [selectedPath, setSelectedPath] = useState<string>('C:');
    const [selectedFile, setSelectedFile] = useState<FileSystemNode | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getFileSystemData();
            setTreeData(data);
            setSelectedPath(data.path);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleNodeSelect = (path: string) => {
        setSelectedPath(path);
        setSelectedFile(null); // Deselect file when folder changes
    };

    const handleFileSelect = (file: FileSystemNode) => {
        setSelectedFile(file);
    };

    const selectedNode = treeData ? findNodeByPath(treeData, selectedPath) : null;
    const currentNodeChildren = selectedNode?.children || (selectedNode?.type === 'folder' ? [] : null);
    
    if (loading) {
        return <div className="text-center p-8">Loading File System...</div>;
    }

    if (!treeData) {
        return <div className="text-center p-8">Could not load file system data.</div>;
    }

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)]">
            <div className="mb-4">
                 <Link to="/analysis" className="text-sm text-primary-500 hover:underline mb-2 block">&larr; Back to Analysis Tools</Link>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">File System Analysis</h2>
            </div>
            <div className="flex-grow flex border dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                {/* File Tree Panel */}
                <div className="w-1/4 border-r dark:border-gray-700 overflow-y-auto p-2">
                    <FileTree 
                        node={treeData} 
                        onSelect={handleNodeSelect}
                        selectedPath={selectedPath}
                    />
                </div>
                
                {/* Main Content Panel */}
                <div className="w-3/4 flex flex-col">
                    {/* File Table */}
                    <div className="h-1/2 border-b dark:border-gray-700 overflow-hidden flex flex-col">
                        <div className="p-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                            <p className="text-sm font-mono text-gray-600 dark:text-gray-400">{selectedPath}</p>
                        </div>
                        <div className="flex-grow overflow-y-auto">
                            {currentNodeChildren ? (
                                <FileTable 
                                    nodes={currentNodeChildren} 
                                    onFileSelect={handleFileSelect}
                                    onFolderSelect={handleNodeSelect}
                                />
                            ) : (
                                <div className="p-4 text-center text-gray-500">Selected item is not a folder.</div>
                            )}
                        </div>
                    </div>

                    {/* File Preview */}
                    <div className="h-1/2 overflow-y-auto">
                       <FilePreview file={selectedFile} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileSystemAnalysisPage;
