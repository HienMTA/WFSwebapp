import React, { useState } from 'react';
import { FileSystemNode } from '../../types';
import { FolderIcon, ChevronRightIcon, ChevronDownIcon } from '../icons/Icons';

interface FileTreeNodeProps {
  node: FileSystemNode;
  onSelect: (path: string) => void;
  selectedPath: string;
  expandedPaths: Set<string>;
  toggleExpand: (path: string) => void;
  level: number;
}

const FileTreeNode: React.FC<FileTreeNodeProps> = ({ node, onSelect, selectedPath, expandedPaths, toggleExpand, level }) => {
  const isFolder = node.type === 'folder';
  const isSelected = selectedPath === node.path;
  const isExpanded = expandedPaths.has(node.path);

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(isFolder) {
      toggleExpand(node.path);
    }
  };
  
  const handleSelect = () => {
    if (isFolder) {
      onSelect(node.path);
    }
  };

  return (
    <div>
      <div
        onClick={handleSelect}
        className={`flex items-center p-1 rounded-md cursor-pointer ${isSelected ? 'bg-primary-100 dark:bg-primary-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        style={{ paddingLeft: `${level * 1.25}rem` }}
      >
        {isFolder && (
          <button onClick={handleToggleExpand} className="mr-1 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
            {isExpanded ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
          </button>
        )}
        <FolderIcon className="w-5 h-5 mr-2 text-yellow-500 flex-shrink-0" />
        <span className="truncate text-sm">{node.name}</span>
      </div>
      {isFolder && isExpanded && node.children && (
        <div>
          {node.children.map(child => (
            <FileTreeNode
              key={child.id}
              node={child}
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


interface FileTreeProps {
    node: FileSystemNode;
    onSelect: (path: string) => void;
    selectedPath: string;
}

const FileTree: React.FC<FileTreeProps> = ({ node, onSelect, selectedPath }) => {
    const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set([node.path]));

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
        <FileTreeNode 
            node={node}
            onSelect={onSelect}
            selectedPath={selectedPath}
            expandedPaths={expandedPaths}
            toggleExpand={toggleExpand}
            level={0}
        />
    );
};

export default FileTree;
