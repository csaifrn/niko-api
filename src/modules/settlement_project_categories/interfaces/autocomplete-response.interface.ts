export interface AutocompleteResponse {
  searchedText: string;
  categories: SettlementProjectCategory[];
}

interface SettlementProjectCategory {
  id: string;
  name: string;
}
