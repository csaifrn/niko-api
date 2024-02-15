export interface GetBatchResponse {
  id: string;
  title: string;
  main_status: number;
  specific_status: number;
  digital_files_count: number;
  physical_files_count: number;
  priority: boolean;
  shelf_number?: string;
  storage_location?: string;
  created_at: Date;
  updated_at: Date;
  created_by: User;
  class_projects: ClassProject[];
  tags: Tag[];
  observations: Observation[];
  assigned_users: AssignedUser[];
}

interface User {
  user_id: string;
  name: string;
  photo?: string;
}

interface ClassProject {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Observation {
  id: string;
  observation: string;
  is_pending: boolean;
  created_by: User;
  created_at: string;
}

interface AssignedUser {
  id: string;
  name: string;
}
