// FIX: Import Host, CollectionJob, and CaseLog from the centralized types.ts file.
import { Case, CaseStatus, CasePriority, User, UserRole, Artefact, FileSystemNode, RegistryHive, RegistryValueType, Host, CollectionJob, CaseLog } from '../types';

export let users: User[] = [
    { user_id: 1, username: 'jdoe', full_name: 'John Doe', email: 'john.doe@example.com', role: UserRole.ADMIN, is_active: true, created_at: '2023-01-15T09:30:00Z', last_login: '2024-07-20T10:00:00Z' },
    { user_id: 2, username: 'asmith', full_name: 'Alice Smith', email: 'alice.smith@example.com', role: UserRole.INVESTIGATOR, is_active: true, created_at: '2023-02-20T11:00:00Z', last_login: '2024-07-21T14:30:00Z' },
    { user_id: 3, username: 'bwilliams', full_name: 'Bob Williams', email: 'bob.williams@example.com', role: UserRole.ANALYST, is_active: true, created_at: '2023-03-10T14:00:00Z', last_login: '2024-07-21T11:20:00Z' },
    { user_id: 4, username: 'cjones', full_name: 'Charlie Jones', email: 'charlie.jones@example.com', role: UserRole.VIEWER, is_active: true, created_at: '2023-04-05T16:45:00Z', last_login: '2024-06-01T08:00:00Z' },
    { user_id: 5, username: 'inactive', full_name: 'Inactive User', email: 'inactive.user@example.com', role: UserRole.VIEWER, is_active: false, created_at: '2023-01-05T16:45:00Z', last_login: '2024-01-01T08:00:00Z' },
];

let cases: Case[] = [
    { case_id: 101, title: 'Unauthorized Access - Server XYZ', description: 'Investigation into unauthorized access on the main web server.', status: CaseStatus.IN_PROGRESS, priority: CasePriority.CRITICAL, created_by: 1, assigned_to: 2, created_at: '2024-07-18T10:00:00Z', updated_at: '2024-07-20T15:30:00Z' },
    { case_id: 102, title: 'Data Exfiltration - Project Phoenix', description: 'Suspected data leak related to Project Phoenix.', status: CaseStatus.OPEN, priority: CasePriority.HIGH, created_by: 1, assigned_to: 2, created_at: '2024-07-19T11:30:00Z', updated_at: '2024-07-19T11:30:00Z' },
    { case_id: 103, title: 'Malware Outbreak - Workstation W01', description: 'A workstation is showing signs of malware infection.', status: CaseStatus.CLOSED, priority: CasePriority.MEDIUM, created_by: 2, assigned_to: 3, created_at: '2024-06-10T09:00:00Z', updated_at: '2024-06-15T18:00:00Z' },
    { case_id: 104, title: 'Phishing Attack - Finance Department', description: 'Multiple users in the finance department reported a phishing email.', status: CaseStatus.IN_PROGRESS, priority: CasePriority.HIGH, created_by: 1, assigned_to: 1, created_at: '2024-07-20T14:00:00Z', updated_at: '2024-07-21T09:15:00Z' },
    { case_id: 105, title: 'Insider Threat Investigation', description: 'Monitoring suspicious activity from an internal user account.', status: CaseStatus.OPEN, priority: CasePriority.MEDIUM, created_by: 2, assigned_to: 1, created_at: '2024-07-21T12:00:00Z', updated_at: '2024-07-21T12:00:00Z' },
];

let artefacts: Artefact[] = [
    { artefact_id: 201, case_id: 101, evidence_type: 'RAM Dump', name: 'server_xyz_memdump.vmem', file_size: 8589934592, mime_type: 'application/octet-stream', collected_at: '2024-07-18T10:15:00Z', collected_by: 2 },
    { artefact_id: 202, case_id: 101, evidence_type: 'Disk Image', name: 'server_xyz_disk0.e01', file_size: 274877906944, mime_type: 'application/octet-stream', collected_at: '2024-07-18T11:00:00Z', collected_by: 2 },
    { artefact_id: 203, case_id: 102, evidence_type: 'Event Logs', name: 'phoenix_logs.evtx', file_size: 104857600, mime_type: 'application/vnd.ms-win-eventlog', collected_at: '2024-07-19T11:45:00Z', collected_by: 2 },
    { artefact_id: 204, case_id: 103, evidence_type: 'Registry Hive', name: 'W01_NTUSER.DAT', file_size: 5242880, mime_type: 'application/octet-stream', collected_at: '2024-06-10T09:30:00Z', collected_by: 3 },
];

// FIX: Removed interface definitions for Host, CollectionJob, and CaseLog as they have been moved to types.ts.

let hosts: Host[] = [
    { host_id: 1, hostname: 'WEB-SRV-01', ip_address: '192.168.1.10', os: 'Windows Server 2022', status: 'ONLINE', last_seen: new Date().toISOString() },
    { host_id: 2, hostname: 'FIN-WS-23', ip_address: '192.168.2.55', os: 'Windows 11 Pro', status: 'ONLINE', last_seen: new Date().toISOString() },
    { host_id: 3, hostname: 'HR-LT-05', ip_address: '192.168.2.101', os: 'Windows 10 Enterprise', status: 'OFFLINE', last_seen: '2024-07-21T08:00:00Z' },
];

let collectionJobs: CollectionJob[] = [
    { job_id: 301, case_id: 101, host_id: 1, profile: 'Memory Dump', status: 'COMPLETED', created_at: '2024-07-18T10:05:00Z', created_by: 2, completed_at: '2024-07-18T10:14:00Z' },
    { job_id: 302, case_id: 104, host_id: 2, profile: 'Quick Triage', status: 'RUNNING', created_at: '2024-07-22T09:30:00Z', created_by: 1 },
];

let caseLogs: CaseLog[] = [
    // Case 101
    { log_id: 1, case_id: 101, user_id: 1, action: 'CASE_CREATED', details: 'Case "Unauthorized Access - Server XYZ" was created.', timestamp: '2024-07-18T10:00:00Z' },
    { log_id: 2, case_id: 101, user_id: 2, action: 'COLLECTION_STARTED', details: 'Started collection job #301 (Memory Dump) on host WEB-SRV-01.', timestamp: '2024-07-18T10:05:00Z' },
    { log_id: 3, case_id: 101, user_id: 2, action: 'ARTEFACT_ADDED', details: 'Added new artefact "server_xyz_memdump.vmem".', timestamp: '2024-07-18T10:15:00Z' },
    { log_id: 4, case_id: 101, user_id: 2, action: 'ARTEFACT_ADDED', details: 'Added new artefact "server_xyz_disk0.e01".', timestamp: '2024-07-18T11:00:00Z' },
    { log_id: 5, case_id: 101, user_id: 1, action: 'CASE_UPDATED', details: 'Case status changed to IN_PROGRESS.', timestamp: '2024-07-20T15:30:00Z' },
    // Case 104
    { log_id: 6, case_id: 104, user_id: 1, action: 'CASE_CREATED', details: 'Case "Phishing Attack - Finance Department" was created.', timestamp: '2024-07-20T14:00:00Z' },
    { log_id: 7, case_id: 104, user_id: 1, action: 'COLLECTION_STARTED', details: 'Started collection job #302 (Quick Triage) on host FIN-WS-23.', timestamp: '2024-07-22T09:30:00Z' },
];


const fileSystemData: FileSystemNode = {
    id: 'c',
    path: 'C:',
    name: 'C:',
    type: 'folder',
    modified: '2024-07-21T10:00:00Z',
    children: [
        {
            id: 'c-users',
            path: 'C:/Users',
            name: 'Users',
            type: 'folder',
            modified: '2024-07-20T11:00:00Z',
            children: [
                {
                    id: 'c-users-jdoe',
                    path: 'C:/Users/jdoe',
                    name: 'jdoe',
                    type: 'folder',
                    modified: '2024-07-21T12:30:00Z',
                    children: [
                        { id: 'c-users-jdoe-desktop', path: 'C:/Users/jdoe/Desktop', name: 'Desktop', type: 'folder', modified: '2024-07-21T12:35:00Z', children: [
                            { id: 'f-screenshot', path: 'C:/Users/jdoe/Desktop/screenshot.png', name: 'screenshot.png', type: 'file', size: 1258291, modified: '2024-07-21T09:15:00Z', mime_type: 'image/png', metadata: { 'Dimensions': '1920x1080', 'Bit Depth': '24' } },
                        ]},
                        { id: 'c-users-jdoe-documents', path: 'C:/Users/jdoe/Documents', name: 'Documents', type: 'folder', modified: '2024-07-20T18:00:00Z', children: [
                            { id: 'f-notes', path: 'C:/Users/jdoe/Documents/notes.txt', name: 'notes.txt', type: 'file', size: 1024, modified: '2024-07-20T18:05:00Z', mime_type: 'text/plain', content: 'Meeting notes:\n- Discuss project phoenix\n- Review server logs\n- Follow up on malware incident', metadata: { 'Encoding': 'UTF-8' } },
                            { id: 'f-report', path: 'C:/Users/jdoe/Documents/final_report.docx', name: 'final_report.docx', type: 'file', size: 25600, modified: '2024-07-19T14:20:00Z', mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', metadata: { 'Author': 'John Doe', 'Pages': '12' } },
                        ]},
                        { id: 'c-users-jdoe-downloads', path: 'C:/Users/jdoe/Downloads', name: 'Downloads', type: 'folder', modified: '2024-07-15T10:00:00Z', children: [
                            { id: 'f-autopsy', path: 'C:/Users/jdoe/Downloads/autopsy-4.20.0.zip', name: 'autopsy-4.20.0.zip', type: 'file', size: 314572800, modified: '2024-07-15T09:55:00Z', mime_type: 'application/zip', metadata: { 'Compressed Size': '300MB' } },
                        ] },
                    ]
                }
            ]
        },
        {
            id: 'c-windows',
            path: 'C:/Windows',
            name: 'Windows',
            type: 'folder',
            modified: '2023-11-01T05:00:00Z',
            children: [
                { id: 'c-windows-system32', path: 'C:/Windows/System32', name: 'System32', type: 'folder', modified: '2024-06-10T11:00:00Z', children: [
                     { id: 'f-calc', path: 'C:/Windows/System32/calc.exe', name: 'calc.exe', type: 'file', size: 27648, modified: '2023-05-11T08:00:00Z', mime_type: 'application/x-msdownload', metadata: { 'Version': '10.0.19041.1' } },
                ] },
            ]
        },
        { id: 'f-evidence', path: 'C:/evidence.e01', name: 'evidence.e01', type: 'file', size: 10737418240, modified: '2024-07-18T11:00:00Z', mime_type: 'application/octet-stream', metadata: { 'MD5': 'd41d8cd98f00b204e9800998ecf8427e', 'SHA1': 'da39a3ee5e6b4b0d3255bfef95601890afd80709' } },
    ]
};

// NEW: Mock Registry Data with more forensic artifacts
const registryData: RegistryHive = {
    name: 'NTUSER.DAT',
    root: {
        id: 'hkcu',
        path: 'HKEY_CURRENT_USER',
        name: 'HKEY_CURRENT_USER',
        lastWriteTimestamp: '2024-07-22T10:00:00Z',
        values: [],
        subkeys: [
            {
                id: 'hkcu-software',
                path: 'HKEY_CURRENT_USER\\Software',
                name: 'Software',
                lastWriteTimestamp: '2024-07-22T10:05:00Z',
                values: [
                     { name: '(Default)', type: RegistryValueType.REG_SZ, data: '(value not set)' },
                ],
                subkeys: [
                    {
                        id: 'hkcu-software-microsoft',
                        path: 'HKEY_CURRENT_USER\\Software\\Microsoft',
                        name: 'Microsoft',
                        lastWriteTimestamp: '2024-07-22T10:05:10Z',
                        values: [],
                        subkeys: [
                             {
                                id: 'hkcu-software-microsoft-windows',
                                path: 'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows',
                                name: 'Windows',
                                lastWriteTimestamp: '2024-07-22T10:06:00Z',
                                values: [],
                                subkeys: [
                                    {
                                        id: 'hkcu-software-microsoft-windows-currentversion',
                                        path: 'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion',
                                        name: 'CurrentVersion',
                                        lastWriteTimestamp: '2024-07-22T10:06:30Z',
                                        values: [],
                                        subkeys: [
                                            {
                                                id: 'hkcu-software-microsoft-windows-currentversion-run',
                                                path: 'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',
                                                name: 'Run',
                                                lastWriteTimestamp: '2024-07-20T08:30:00Z',
                                                values: [
                                                    { name: 'OneDrive', type: RegistryValueType.REG_SZ, data: '"C:\\Program Files\\Microsoft OneDrive\\OneDrive.exe" /background' },
                                                    { name: 'SuspiciousApp', type: RegistryValueType.REG_SZ, data: 'C:\\Users\\jdoe\\AppData\\Local\\Temp\\malicious.exe -run' },
                                                ],
                                                subkeys: [],
                                            },
                                            {
                                                id: 'hkcu-software-microsoft-windows-currentversion-explorer',
                                                path: 'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer',
                                                name: 'Explorer',
                                                lastWriteTimestamp: '2024-07-21T14:20:00Z',
                                                values: [],
                                                subkeys: [
                                                    {
                                                        id: 'hkcu-software-microsoft-windows-currentversion-explorer-typedpaths',
                                                        path: 'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\TypedPaths',
                                                        name: 'TypedPaths',
                                                        lastWriteTimestamp: '2024-07-21T14:22:00Z',
                                                        values: [
                                                            { name: 'url1', type: RegistryValueType.REG_SZ, data: 'C:\\Users\\jdoe\\Documents\\secret.docx' },
                                                            { name: 'url2', type: RegistryValueType.REG_SZ, data: '\\\\fileserver\\shares\\confidential' },
                                                        ],
                                                        subkeys: [],
                                                    },
                                                    {
                                                        id: 'hkcu-software-microsoft-windows-currentversion-explorer-userassist',
                                                        path: 'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\UserAssist',
                                                        name: 'UserAssist',
                                                        lastWriteTimestamp: '2024-07-21T15:00:00Z',
                                                        values: [],
                                                        subkeys: [
                                                            {
                                                                id: 'hkcu-software-microsoft-windows-currentversion-explorer-userassist-guid1',
                                                                path: 'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\UserAssist\\{CEBFF5CD-ACE2-4F4F-9178-9926F41749EA}',
                                                                name: '{CEBFF5CD-ACE2-4F4F-9178-9926F41749EA}',
                                                                lastWriteTimestamp: '2024-07-21T15:01:00Z',
                                                                values: [
                                                                    // ROT13 encoded values
                                                                    { name: 'P:\\Hfref\\wqbr\\Qbfxhcc\\frperg.rkr', type: RegistryValueType.REG_BINARY, data: '...binary data...' }, // C:\Users\jdoe\Desktop\secret.exe
                                                                    { name: 'P:\\Cebtenz Svyrf\\Zvpebfbsg Bssvpr\\BSSVPR16\\RKPRY.RKR', type: RegistryValueType.REG_BINARY, data: '...binary data...' }, // C:\Program Files\Microsoft Office\OFFICE16\EXCEL.EXE
                                                                ],
                                                                subkeys: [],
                                                            }
                                                        ],
                                                    }
                                                ],
                                            },
                                        ]
                                    }
                                ]
                            },
                             {
                                id: 'hkcu-software-microsoft-windows-currentversion-enum',
                                path: 'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Enum',
                                name: 'Enum',
                                lastWriteTimestamp: '2024-07-19T11:00:00Z',
                                values: [],
                                subkeys: [
                                     {
                                        id: 'hkcu-software-microsoft-windows-currentversion-enum-usbstor',
                                        path: 'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Enum\\USBSTOR',
                                        name: 'USBSTOR',
                                        lastWriteTimestamp: '2024-07-19T11:05:00Z',
                                        values: [],
                                        subkeys: [
                                             {
                                                id: 'usbstor-kingston',
                                                path: 'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Enum\\USBSTOR\\Disk&Ven_Kingston&Prod_DataTraveler_3.0&Rev_PMAP',
                                                name: 'Disk&Ven_Kingston&Prod_DataTraveler_3.0&Rev_PMAP',
                                                lastWriteTimestamp: '2024-07-19T11:05:10Z',
                                                values: [ { name: 'FriendlyName', type: RegistryValueType.REG_SZ, data: 'Kingston DataTraveler 3.0 USB Device' } ],
                                                subkeys: [],
                                            }
                                        ],
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

const simulateDelay = <T,>(data: T): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), 500));

// NEW: Helper function to create a case log
const createCaseLog = (logData: Omit<CaseLog, 'log_id' | 'timestamp'>) => {
    const newLog: CaseLog = {
        ...logData,
        log_id: Math.max(...caseLogs.map(l => l.log_id), 0) + 1,
        timestamp: new Date().toISOString(),
    };
    caseLogs.push(newLog);
};

export const authenticateUser = async (username: string): Promise<User | null> => {
    const user = users.find(u => u.username === username && u.is_active);
    return simulateDelay(user || null);
}

export const getDashboardData = async () => {
    const sortedLogs = [...caseLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const recentLogs = sortedLogs.slice(0, 5).map(log => {
        const user = users.find(u => u.user_id === log.user_id);
        return {
            ...log,
            userName: user ? user.full_name : 'Unknown User',
        };
    });

    return simulateDelay({
        totalCases: cases.length,
        openCases: cases.filter(c => c.status === CaseStatus.OPEN).length,
        inProgressCases: cases.filter(c => c.status === CaseStatus.IN_PROGRESS).length,
        highPriorityCases: cases.filter(c => c.priority === CasePriority.HIGH || c.priority === CasePriority.CRITICAL).length,
        allCases: [...cases],
        recentLogs,
    });
};

// Cases CRUD
export const getCases = async (): Promise<Case[]> => simulateDelay([...cases]);
export const getCaseById = async (id: number): Promise<Case | undefined> => simulateDelay(cases.find(c => c.case_id === id));

export const createCase = async (caseData: Omit<Case, 'case_id' | 'created_at' | 'updated_at'>, creatorId: number): Promise<Case> => {
    const newCase: Case = {
        ...caseData,
        case_id: Math.max(...cases.map(c => c.case_id)) + 1,
        created_by: creatorId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    cases.push(newCase);

    createCaseLog({
        case_id: newCase.case_id,
        user_id: creatorId,
        action: 'CASE_CREATED',
        details: `Case "${newCase.title}" was created.`,
    });

    return simulateDelay(newCase);
};

export const updateCase = async (caseId: number, caseData: Partial<Omit<Case, 'case_id' | 'created_by' | 'created_at' | 'updated_at'>>, updaterId: number): Promise<Case> => {
    const caseIndex = cases.findIndex(c => c.case_id === caseId);
    if (caseIndex === -1) throw new Error("Case not found");

    const originalCase = { ...cases[caseIndex] };
    const updatedCase = { ...cases[caseIndex], ...caseData, updated_at: new Date().toISOString() };
    cases[caseIndex] = updatedCase;

    // Log changes
    const changes = Object.keys(caseData).map(key => {
        const typedKey = key as keyof typeof caseData;
        if (originalCase[typedKey] !== updatedCase[typedKey]) {
            return `Changed ${key} from "${originalCase[typedKey]}" to "${updatedCase[typedKey]}".`;
        }
        return null;
    }).filter(Boolean).join(' ');

    if (changes) {
        createCaseLog({
            case_id: caseId,
            user_id: updaterId,
            action: 'CASE_UPDATED',
            details: changes || 'Case details were updated.',
        });
    }

    return simulateDelay(updatedCase);
};

export const deleteCase = async (caseId: number): Promise<{ success: true }> => {
    cases = cases.filter(c => c.case_id !== caseId);
    // Note: In a real system, we might log this action too, but for now we'll skip it.
    return simulateDelay({ success: true });
};

// Users CRUD
export const getUsers = async (): Promise<User[]> => simulateDelay([...users]);

export const createUser = async (userData: Omit<User, 'user_id' | 'created_at' | 'last_login'>): Promise<User> => {
    const newUser: User = {
        ...userData,
        user_id: Math.max(...users.map(u => u.user_id)) + 1,
        created_at: new Date().toISOString(),
        last_login: null,
    };
    users.push(newUser);
    return simulateDelay(newUser);
};

export const updateUser = async (userId: number, userData: Partial<Omit<User, 'user_id'>>): Promise<User> => {
    const userIndex = users.findIndex(u => u.user_id === userId);
    if (userIndex === -1) throw new Error("User not found");

    users[userIndex] = { ...users[userIndex], ...userData };
    return simulateDelay(users[userIndex]);
};

export const deleteUser = async (userId: number): Promise<{ success: true }> => {
    users = users.filter(u => u.user_id !== userId);
    return simulateDelay({ success: true });
};

// Artefacts
export const getArtefactsForCase = async (caseId: number): Promise<Artefact[]> => simulateDelay(artefacts.filter(a => a.case_id === caseId));

export const createArtefact = async (artefactData: Omit<Artefact, 'artefact_id' | 'collected_at'>): Promise<Artefact> => {
    const newArtefact: Artefact = {
        ...artefactData,
        artefact_id: Math.max(...artefacts.map(a => a.artefact_id), 0) + 1,
        collected_at: new Date().toISOString(),
    };
    artefacts.push(newArtefact);
    
    createCaseLog({
        case_id: newArtefact.case_id,
        user_id: newArtefact.collected_by,
        action: 'ARTEFACT_ADDED',
        details: `Added new artefact "${newArtefact.name}".`,
    });

    return simulateDelay(newArtefact);
};

// File System
export const getFileSystemData = async (): Promise<FileSystemNode> => simulateDelay(JSON.parse(JSON.stringify(fileSystemData)));

// NEW: Registry
export const getRegistryHiveData = async (): Promise<RegistryHive> => simulateDelay(JSON.parse(JSON.stringify(registryData)));


// Hosts and Collection
export const getHosts = async (): Promise<Host[]> => simulateDelay([...hosts]);

export const getCollectionJobsForCase = async (caseId: number): Promise<CollectionJob[]> => simulateDelay(collectionJobs.filter(j => j.case_id === caseId));

export const startCollectionJob = async (caseId: number, hostId: number, profile: string, creatorId: number): Promise<CollectionJob> => {
    const newJob: CollectionJob = {
        job_id: Math.max(...collectionJobs.map(j => j.job_id), 0) + 1,
        case_id: caseId,
        host_id: hostId,
        profile: profile,
        status: 'PENDING',
        created_at: new Date().toISOString(),
        created_by: creatorId,
    };
    collectionJobs.push(newJob);

    const host = hosts.find(h => h.host_id === hostId);
    createCaseLog({
        case_id: caseId,
        user_id: creatorId,
        action: 'COLLECTION_STARTED',
        details: `Started collection job #${newJob.job_id} (${profile}) on host ${host?.hostname || 'Unknown'}.`,
    });

    // Simulate job progress
    setTimeout(() => {
        const jobIndex = collectionJobs.findIndex(j => j.job_id === newJob.job_id);
        if (jobIndex > -1) collectionJobs[jobIndex].status = 'RUNNING';
    }, 3000);

    setTimeout(() => {
        const jobIndex = collectionJobs.findIndex(j => j.job_id === newJob.job_id);
        if (jobIndex > -1) {
            collectionJobs[jobIndex].status = 'COMPLETED';
            collectionJobs[jobIndex].completed_at = new Date().toISOString();
            // Simulate creating an artefact
            createArtefact({
                case_id: caseId,
                evidence_type: profile,
                name: `${profile.replace(' ', '_')}_${new Date().getTime()}.zip`,
                file_size: Math.floor(Math.random() * 1e9) + 1e8,
                mime_type: 'application/zip',
                collected_by: creatorId
            });
        }
    }, 15000);


    return simulateDelay(newJob);
};

// NEW: Case Logs
export const getLogsForCase = async (caseId: number): Promise<CaseLog[]> => {
    const logs = caseLogs
        .filter(l => l.case_id === caseId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return simulateDelay(logs);
}