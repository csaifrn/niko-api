export interface CreatedBatchResponse {
  id: string;
  title: string;
  main_status: number;
  specific_status: number;
  physical_files_count: number;
  digital_files_count: number;
  priority: boolean;
}
