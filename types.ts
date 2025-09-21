

export enum UserRole {
  ADMIN = 'ADMIN',
  INVESTIGATOR = 'INVESTIGATOR',
  ANALYST = 'ANALYST',
  VIEWER = 'VIEWER',
}

export enum CaseStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

export enum CasePriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}

export interface User {
  user_id: number;
  username: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}

export interface Case {
  case_id: number;
  title: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  created_by: number;
  assigned_to: number;
  created_at: string;
  updated_at: string;
}

export interface Artefact {
  artefact_id: number;
  case_id: number;
  evidence_type: string;
  name: string;
  file_size: number;
  mime_type: string;
  collected_at: string;
  collected_by: number;
}

export interface FileSystemNode {
  id: string;
  path: string;
  name: string;
  type: 'folder' | 'file';
  size?: number;
  modified: string;
  children?: FileSystemNode[];
  content?: string;
  mime_type?: string;
  metadata?: Record<string, string>;
}

// NEW: Registry Analysis Types
export enum RegistryValueType {
    REG_SZ = 'REG_SZ',
    REG_EXPAND_SZ = 'REG_EXPAND_SZ',
    REG_BINARY = 'REG_BINARY',
    REG_DWORD = 'REG_DWORD',
    REG_QWORD = 'REG_QWORD',
    REG_MULTI_SZ = 'REG_MULTI_SZ',
    REG_NONE = 'REG_NONE',
}

export interface RegistryValue {
    name: string;
    type: RegistryValueType;
    data: string | number | string[];
}

export interface RegistryKey {
    id: string;
    path: string;
    name: string;
    lastWriteTimestamp: string;
    values: RegistryValue[];
    subkeys: RegistryKey[];
}

export interface RegistryHive {
    name: string;
    root: RegistryKey;
}

// NEW: Types for Automated Registry Analysis
export interface AnalysisFinding {
    category: string;
    path: string;
    value: RegistryValue;
    description: string;
}

export type AutomatedAnalysisReport = Record<string, AnalysisFinding[]>;


// FIX: Moved Host, CollectionJob, and CaseLog interfaces here from services/mockApi.ts to centralize types and resolve import errors.
export interface Host {
    host_id: number;
    hostname: string;
    ip_address: string;
    os: string;
    status: 'ONLINE' | 'OFFLINE';
    last_seen: string;
}

export interface CollectionJob {
    job_id: number;
    case_id: number;
    host_id: number;
    profile: string;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
    created_at: string;
    created_by: number;
    completed_at?: string;
}

export interface CaseLog {
    log_id: number;
    case_id: number;
    user_id: number;
    action: string;
    details: string;
    timestamp: string;
}