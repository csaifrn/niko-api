export interface UpdatedBatchResponse {
  id: string;
  title: string;
  physical_files_count: number;
  digital_files_count: number;
  priority: boolean;
  updated_at: Date;
}
