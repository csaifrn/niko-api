export interface ListBatchesStatusResponse {
  batches_count: number;
  batches: Batch[];
}

interface Batch {
  main_status: number;
  specific_status: number;
}
