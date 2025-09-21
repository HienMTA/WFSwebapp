import React, { useState } from 'react';
import { RegistryKey } from '../../types';
import { KeyIcon, ChevronRightIcon, ChevronDownIcon } from '../icons/Icons';

interface RegistryTreeNodeProps {
  node: RegistryKey;
  onSelect: (path: string) => void;
  selectedPath: string;
  expandedPaths: Set<string>;
  toggleExpand: (path: string) => void;
  level: number;
}

const RegistryTreeNode: React.FC<RegistryTreeNodeProps> = ({ node, onSelect, selectedPath, expandedPaths, toggleExpand, level }) => {
  const isSelected = selectedPath === node.path;
  const isExpanded = expandedPaths.has(node.path);

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleExpand(node.path);
  };
  
  const handleSelect = () => {
    onSelect(node.path);
  };

  return (
    <div>
      <div
        onClick={handleSelect}
        className={`flex items-center p-1 rounded-md cursor-pointer ${isSelected ? 'bg-primary-100 dark:bg-primary-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        style={{ paddingLeft: `${level * 1.25}rem` }}
      >
        {node.subkeys.length > 0 && (
          <button onClick={handleToggleExpand} className="mr-1 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
            {isExpanded ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
          </button>
        )}
        {node.subkeys.length === 0 && <span className="w-5 mr-1"></span>}

        <KeyIcon className="w-4 h-4 mr-2 text-yellow-600 flex-shrink-0" />
        <span className="truncate text-sm">{node.name}</span>
      </div>
      {isExpanded && node.subkeys && (
        <div>
          {node.subkeys.map(subkey => (
            <RegistryTreeNode
              key={subkey.id}
              node={subkey}
              onSelect={onSelect}
              selectedPath={selectedPath}
              expandedPaths={expandedPaths}
              toggleExpand={toggleExpand}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};


interface RegistryTreeProps {
    node: RegistryKey;
    onSelect: (path: string) => void;
    selectedPath: string;
}

const RegistryTree: React.FC<RegistryTreeProps> = ({ node, onSelect, selectedPath }) => {
    const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set([node.path, ...selectedPath.split('\\').slice(0, -1).map((_, i, arr) => arr.slice(0, i + 1).join('\\'))]));

    const toggleExpand = (path: string) => {
        setExpandedPaths(prev => {
            const newSet = new Set(prev);
            if (newSet.has(path)) {
                newSet.delete(path);
            } else {
                newSet.add(path);
            }
            return newSet;
        });
    };

    return (
        <RegistryTreeNode 
            node={node}
            onSelect={onSelect}
            selectedPath={selectedPath}
            expandedPaths={expandedPaths}
            toggleExpand={toggleExpand}
            level={0}
        />
    );
};

export default RegistryTree;