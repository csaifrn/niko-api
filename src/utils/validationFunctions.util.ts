export const isNameValid = (name: string): boolean => {
  const MIN_CHARACTERS = 6;
  return name.length < MIN_CHARACTERS;
};

export const isPasswordValid = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{6,}$/;
  return passwordRegex.test(password);
};

export const isEmailValid = (email: string): boolean => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return emailRegex.test(email);
};

export const isSettlementProjectValid = (
  settlementProject: string,
): boolean => {
  const MIN_CHARACTERS = 3;
  return settlementProject.length < MIN_CHARACTERS;
};

export const isFilesCountValid = (files_count: number): boolean => {
  return files_count <= 0;
};

export const isUpdateFilesCountValid = (files_count: number): boolean => {
  return files_count < 0;
};

export const isBatchObservationValid = (observation: string): boolean => {
  const MIN_CHARACTERS = 3;
  return observation.length < MIN_CHARACTERS;
};
