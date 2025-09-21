import { RegistryKey, AutomatedAnalysisReport, AnalysisFinding, RegistryValue } from "../types";

// Simple ROT13 decoder for UserAssist keys
const rot13 = (str: string): string => {
    // FIX: Refactored ROT13 implementation to be type-safe and more readable.
    return str.replace(/[a-zA-Z]/g, (c) => {
        const newCharCode = c.charCodeAt(0) + 13;
        const limit = c <= "Z" ? 90 : 122;
        return String.fromCharCode(newCharCode > limit ? newCharCode - 26 : newCharCode);
    });
};

function findKeysAndValues(
    key: RegistryKey,
    predicate: (key: RegistryKey) => boolean
): { key: RegistryKey; values: RegistryValue[] }[] {
    const results: { key: RegistryKey; values: RegistryValue[] }[] = [];
    
    function recurse(currentKey: RegistryKey) {
        if (predicate(currentKey)) {
            results.push({ key: currentKey, values: currentKey.values });
        }
        for (const subkey of currentKey.subkeys) {
            recurse(subkey);
        }
    }
    
    recurse(key);
    return results;
}


export const runAutomatedAnalysis = (rootKey: RegistryKey): AutomatedAnalysisReport => {
    const report: AutomatedAnalysisReport = {};

    const addFinding = (finding: Omit<AnalysisFinding, 'category'>, category: string) => {
        if (!report[category]) {
            report[category] = [];
        }
        report[category].push({ ...finding, category });
    };

    // 1. Scan for Persistence
    const persistenceKeys = findKeysAndValues(rootKey, (key) => key.path.toLowerCase().endsWith('\\run'));
    for (const { key, values } of persistenceKeys) {
        for (const value of values) {
            const dataStr = value.data.toString().toLowerCase();
            let description = 'Standard auto-run entry.';
            if (dataStr.includes('\\temp\\') || dataStr.includes('\\appdata\\')) {
                description = 'Suspicious auto-run entry pointing to a temporary or user-specific folder.';
            }
            addFinding({ path: key.path, value, description }, 'Persistence');
        }
    }

    // 2. Scan for User Activity - TypedPaths
    const typedPathsKeys = findKeysAndValues(rootKey, (key) => key.path.toLowerCase().endsWith('\\explorer\\typedpaths'));
    for (const { key, values } of typedPathsKeys) {
        for (const value of values) {
             addFinding({ path: key.path, value, description: 'Path typed into Windows Explorer or the Run dialog.' }, 'User Activity');
        }
    }

    // 3. Scan for User Activity - UserAssist (and decode)
    const userAssistKeys = findKeysAndValues(rootKey, (key) => key.path.toLowerCase().includes('\\userassist\\'));
     for (const { key, values } of userAssistKeys) {
        for (const value of values) {
             const decodedName = rot13(value.name);
             addFinding({ 
                path: key.path, 
                value: { ...value, name: decodedName }, // show decoded name in report
                description: `Execution of program or shortcut: ${decodedName}. Data indicates execution count and focus time.` 
            }, 'User Activity');
        }
    }

    // 4. Scan for Connected USB Devices
    const usbStorKeys = findKeysAndValues(rootKey, (key) => key.path.toLowerCase().includes('\\enum\\usbstor'));
    for (const { key, values } of usbStorKeys) {
        const friendlyNameValue = values.find(v => v.name === 'FriendlyName');
        const description = friendlyNameValue 
            ? `USB device connected: ${friendlyNameValue.data}`
            : 'USB device connection recorded.';

        addFinding({
            path: key.path,
            value: friendlyNameValue || { name: 'Device Info', type: key.values[0]?.type, data: key.name },
            description
        }, 'Connected Devices');
    }


    return report;
};