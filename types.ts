
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