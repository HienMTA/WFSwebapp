import React from 'react';
import { FileSystemNode } from '../../types';
import { FolderIcon, FileIcon, FileImageIcon, FileTextIcon, FileZipIcon } from '../icons/Icons';

const getFileIcon = (node: FileSystemNode) => {
    if (node.type === 'folder') {
        return <FolderIcon className="w-5 h-5 text-yellow-500" />;
    }
    if (node.mime_type?.startsWith('image/')) {
        return <FileImageIcon className="w-5 h-5 text-purple-500" />;
    }
    if (node.mime_type === 'text/plain') {
        return <FileTextIcon className="w-5 h-5 text-blue-500" />;
    }
    if (node.mime_type === 'application/zip') {
        return <FileZipIcon className="w-5 h-5 text-red-500" />;
    }
    return <FileIcon className="w-5 h-5 text-gray-500" />;
};

const formatBytes = (bytes?: number, decimals = 2) => {
    if (bytes === undefined || bytes === 0) return '';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


interface FileTableProps {
  nodes: FileSystemNode[];
  onFileSelect: (file: FileSystemNode) => void;
  onFolderSelect: (path: string) => void;
}

const FileTable: React.FC<FileTableProps> = ({ nodes, onFileSelect, onFolderSelect }) => {
    const handleRowClick = (node: FileSystemNode) => {
        if (node.type === 'file') {
            onFileSelect(node);
        } else {
            onFolderSelect(node.path);
        }
    };
    
    return (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                <tr>
                    <th scope="col" className="px-6 py-3 w-3/5">Name</th>
                    <th scope="col" className="px-6 py-3">Date modified</th>
                    <th scope="col" className="px-6 py-3">Type</th>
                    <th scope="col" className="px-6 py-3">Size</th>
                </tr>
            </thead>
            <tbody>
                {nodes.map(node => (
                    <tr 
                        key={node.id} 
                        onClick={() => handleRowClick(node)}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                    >
                        <td className="px-6 py-2 font-medium text-gray-900 dark:text-white flex items-center">
                           {getFileIcon(node)}
                           <span className="ml-2 truncate">{node.name}</span>
                        </td>
                        <td className="px-6 py-2">{new Date(node.modified).toLocaleString()}</td>
                        <td className="px-6 py-2 capitalize">{node.type}</td>
                        <td className="px-6 py-2 text-right">{formatBytes(node.size)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default FileTable;
