export interface GetBatchResponse {
  id: string;
  title: string;
  main_status: number;
  specific_status: number;
  digital_files_count: number;
  physical_files_count: number;
  priority: boolean;
  shelf_number?: number;
  created_at: Date;
  updated_at: Date;
  created_by: User;
  category: SettlementProjectCategory;
  observations: Observation[];
  assigned_users: AssignedUser[];
}

interface User {
  user_id: string;
  name: string;
}

interface SettlementProjectCategory {
  settlement_project_category_id: string;
  name: string;
}

export interface Observation {
  id: string;
  observation: string;
  created_by: User;
  created_at: string;
}

interface AssignedUser {
  id: string;
  name: string;
}
