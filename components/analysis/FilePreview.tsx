import React, { useState } from 'react';
import { FileSystemNode } from '../../types';
import Button from '../ui/Button';

type Tab = 'preview' | 'metadata' | 'hex';

const FilePreview: React.FC<{ file: FileSystemNode | null }> = ({ file }) => {
    const [activeTab, setActiveTab] = useState<Tab>('preview');

    if (!file) {
        return <div className="p-6 text-center text-gray-500 dark:text-gray-400 h-full flex items-center justify-center">Select a file to preview its contents.</div>
    }

    const renderPreview = () => {
        if (file.mime_type?.startsWith('image/')) {
            return <div className="p-4 flex justify-center items-center h-full bg-gray-200 dark:bg-gray-900"><img src={`https://via.placeholder.com/400x300.png/000000/FFFFFF?text=${file.name}`} alt={file.name} className="max-w-full max-h-full object-contain" /></div>
        }
        if (file.mime_type === 'text/plain') {
            return <pre className="p-4 text-sm whitespace-pre-wrap dark:text-gray-300">{file.content}</pre>
        }
        return <div className="p-6 text-center text-gray-500">No preview available for this file type.</div>
    };
    
    const renderMetadata = () => (
        <div className="p-4">
            <dl className="grid grid-cols-3 gap-x-4 gap-y-4 text-sm">
                <dt className="font-medium text-gray-500">File Name</dt><dd className="col-span-2">{file.name}</dd>
                <dt className="font-medium text-gray-500">File Path</dt><dd className="col-span-2 font-mono">{file.path}</dd>
                <dt className="font-medium text-gray-500">Size</dt><dd className="col-span-2">{file.size} Bytes</dd>
                <dt className="font-medium text-gray-500">Modified</dt><dd className="col-span-2">{new Date(file.modified).toLocaleString()}</dd>
                <dt className="font-medium text-gray-500">MIME Type</dt><dd className="col-span-2">{file.mime_type || 'N/A'}</dd>
            </dl>
            {file.metadata && Object.keys(file.metadata).length > 0 && (
                <>
                    <hr className="my-4 dark:border-gray-600" />
                    <h4 className="font-semibold text-md mb-2">Extended Metadata</h4>
                    <dl className="grid grid-cols-3 gap-x-4 gap-y-4 text-sm">
                        {Object.entries(file.metadata).map(([key, value]) => (
                            <React.Fragment key={key}>
                                <dt className="font-medium text-gray-500">{key}</dt>
                                <dd className="col-span-2">{value}</dd>
                            </React.Fragment>
                        ))}
                    </dl>
                </>
            )}
        </div>
    );
    
    const renderHexView = () => (
        <div className="p-4 font-mono text-xs overflow-x-auto">
            <pre className="dark:text-gray-300">
                {'00000000  4d 5a 90 00 03 00 00 00 04 00 00 00 ff ff 00 00  MZ..............\n'}
                {'00000010  b8 00 00 00 00 00 00 00 40 00 00 00 00 00 00 00  ........@.......\n'}
                {'00000020  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................\n'}
                {'00000030  00 00 00 00 00 00 00 00 00 00 00 00 f0 00 00 00  ................\n'}
                {'00000040  0e 1f ba 0e 00 b4 09 cd 21 b8 01 4c cd 21 54 68  ........!..L.!Th\n'}
                {'00000050  69 73 20 70 72 6f 67 72 61 6d 20 63 61 6e 6e 6f  is program canno\n'}
                {'00000060  74 20 62 65 20 72 75 6e 20 69 6e 20 44 4f 53 20  t be run in DOS \n'}
                {'00000070  6d 6f 64 65 2e 0d 0d 0a 24 00 00 00 00 00 00 00  mode....$.......\n'}
                {'........ [Simulated Hex View] ........'}
            </pre>
        </div>
    );


    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 border-b dark:border-gray-700 p-2 flex justify-between items-center">
                <div className="flex space-x-1">
                    {(['preview', 'metadata', 'hex'] as Tab[]).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1 text-sm font-medium rounded-md ${activeTab === tab ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                           {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
                <Button variant="secondary" size="sm">Download</Button>
            </div>
            <div className="flex-grow overflow-y-auto">
                {activeTab === 'preview' && renderPreview()}
                {activeTab === 'metadata' && renderMetadata()}
                {activeTab === 'hex' && renderHexView()}
            </div>
        </div>
    );
};

export default FilePreview;
