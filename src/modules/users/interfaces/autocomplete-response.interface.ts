export interface AutocompleteResponse {
  searchedText: string;
  users: Users[];
}

interface Users {
  id: string;
  name: string;
}
