import React from 'react';
import { RegistryValue } from '../../types';
import { ExclamationTriangleIcon } from '../icons/Icons';

const formatData = (value: RegistryValue) => {
    if (typeof value.data === 'number') {
        return `0x${value.data.toString(16)} (${value.data})`;
    }
    if (Array.isArray(value.data)) {
        return value.data.join(', ');
    }
    return value.data.toString();
};

const isSuspicious = (keyPath: string, value: RegistryValue): string | null => {
    const data = (value.data || '').toString().toLowerCase();
    
    // Rule 1: Executable in temp/appdata path in a Run key
    if (keyPath.toLowerCase().endsWith('\\run')) {
        if (data.endsWith('.exe') && (data.includes('\\temp\\') || data.includes('\\appdata\\'))) {
            return 'Potential malware persistence via Run key pointing to a temporary location.';
        }
    }

    // Rule 2: Suspicious file extensions from UserAssist
    if (keyPath.toLowerCase().includes('userassist')) {
        // FIX: Refactored ROT13 implementation to be type-safe and more readable.
        const decodedName = value.name.replace(/[a-zA-Z]/g, c => {
            const newCharCode = c.charCodeAt(0) + 13;
            const limit = c <= 'Z' ? 90 : 122;
            return String.fromCharCode(newCharCode > limit ? newCharCode - 26 : newCharCode);
        });
        if (decodedName.endsWith('.exe') || decodedName.endsWith('.bat') || decodedName.endsWith('.vbs')) {
             return 'Execution of a program file recorded in UserAssist.';
        }
    }
    
    return null;
}


interface RegistryValueTableProps {
  values: RegistryValue[];
  onValueSelect: (value: RegistryValue) => void;
  currentKeyPath: string;
}

const RegistryValueTable: React.FC<RegistryValueTableProps> = ({ values, onValueSelect, currentKeyPath }) => {
    
    return (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 sticky top-0">
                <tr>
                    <th scope="col" className="px-6 py-3 w-1/3">Name</th>
                    <th scope="col" className="px-6 py-3 w-1/5">Type</th>
                    <th scope="col" className="px-6 py-3">Data</th>
                </tr>
            </thead>
            <tbody>
                {values.map((value, index) => {
                    const suspicionReason = isSuspicious(currentKeyPath, value);
                    return (
                        <tr 
                            key={`${value.name}-${index}`} 
                            onClick={() => onValueSelect(value)}
                            title={suspicionReason || ''}
                            className={`border-b dark:border-gray-700 cursor-pointer 
                                ${suspicionReason ? 
                                    'bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/40' 
                                    : 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-600'
                                }`}
                        >
                            <td className={`px-6 py-2 font-medium text-gray-900 dark:text-white truncate ${value.name === '(Default)' ? 'italic text-gray-500' : ''}`}>
                               <div className="flex items-center">
                                    {suspicionReason && <ExclamationTriangleIcon className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0" />}
                                    <span>{value.name}</span>
                               </div>
                            </td>
                            <td className="px-6 py-2 font-mono text-xs">{value.type}</td>
                            <td className="px-6 py-2 truncate">{formatData(value)}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    );
};

export default RegistryValueTable;