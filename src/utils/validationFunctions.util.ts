export const isNameValid = (name: string): boolean => {
  const MIN_CHARACTERS = 6;
  return name.length < MIN_CHARACTERS;
};
