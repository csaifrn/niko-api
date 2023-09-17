export interface GetBatchResponse {
  id: string;
  settlement_project: string;
  digital_files_count: string;
  physical_files_count: string;
  priority: string;
  shelf_number: string;
  created_at: string;
  updated_at: string;
  created_by: User;
  category: SettlementProjectCategory;
}

interface User {
  user_id: string;
  name: string;
}

interface SettlementProjectCategory {
  settlement_project_category_id: string;
  name: string;
}
