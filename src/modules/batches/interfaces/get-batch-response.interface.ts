export interface GetBatchResponse {
  id: string;
  settlement_project: string;
  created_at: string;
  updated_at: string;
  created_by: User;
}

interface User {
  user_id: string;
  name: string;
}
