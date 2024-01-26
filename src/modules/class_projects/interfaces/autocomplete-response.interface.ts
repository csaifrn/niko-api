export interface AutocompleteResponse {
  searchedText: string;
  classes: ClassProject[];
}

interface ClassProject {
  id: string;
  name: string;
}
