import React from 'react';
import { RegistryValue, RegistryValueType } from '../../types';

const renderHexView = (data: string) => {
    const lines = [];
    for (let i = 0; i < data.length; i += 16) {
        const slice = data.slice(i, i + 16);
        const hex = slice.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
        const ascii = slice.replace(/[\x00-\x1F\x7F-\xFF]/g, '.');
        const offset = i.toString(16).padStart(8, '0');
        lines.push(`${offset}  ${hex.padEnd(47)}  ${ascii}`);
    }
    return lines.join('\n');
}

const RegistryDataViewer: React.FC<{ value: RegistryValue | null }> = ({ value }) => {

    if (!value) {
        return <div className="p-6 text-center text-gray-500 dark:text-gray-400 h-full flex items-center justify-center">Select a value to see its data.</div>
    }

    const renderContent = () => {
        switch (value.type) {
            case RegistryValueType.REG_BINARY:
                return (
                    <pre className="p-4 font-mono text-xs whitespace-pre-wrap dark:text-gray-300">
                        {renderHexView(value.data.toString())}
                    </pre>
                );
            case RegistryValueType.REG_DWORD:
            case RegistryValueType.REG_QWORD:
                return (
                    <div className="p-4">
                        <p>Decimal: <span className="font-mono">{value.data}</span></p>
                        <p>Hex: <span className="font-mono">0x{(value.data as number).toString(16)}</span></p>
                    </div>
                );
            case RegistryValueType.REG_MULTI_SZ:
                return (
                    <ul className="p-4 list-disc list-inside">
                        {(value.data as string[]).map((str, i) => <li key={i}>{str}</li>)}
                    </ul>
                );
            case RegistryValueType.REG_SZ:
            case RegistryValueType.REG_EXPAND_SZ:
            default:
                return (
                    <pre className="p-4 text-sm whitespace-pre-wrap dark:text-gray-300">{value.data}</pre>
                );
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 border-b dark:border-gray-700 p-2">
                 <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100">Data for: <span className="font-mono text-primary-600 dark:text-primary-400 text-sm">{value.name}</span></h4>
            </div>
            <div className="flex-grow overflow-y-auto">
               {renderContent()}
            </div>
        </div>
    );
};

export default RegistryDataViewer;
