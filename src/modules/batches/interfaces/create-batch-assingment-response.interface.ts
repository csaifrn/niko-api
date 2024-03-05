export interface CreatedBatchAssingmentResponse {
  id: string;
  title: string;
  physical_files_count: number;
  digital_files_count: number;
  priority: boolean;
  assignedUsers: AssignedUser[];
}

interface AssignedUser {
  id: string;
  name: string;
}
