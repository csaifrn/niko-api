import { UserRole } from '../common/enums/user-role.enum';
import { MainStatusBatch } from '../modules/batches/enum/main-status-batch.enum';
import { SpecificStatusBatch } from '../modules/batches/enum/specific-status-batch.enum';
import * as validationConstants from './validationConstants';

export const isNameValid = (name: string): boolean => {
  return name.length < validationConstants.MIN_USERNAME_CHARACTERS;
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

export const isSettlementProjectInvalid = (
  settlementProject: string,
): boolean => {
  return (
    settlementProject.length <
    validationConstants.MIN_SETTLEMENT_PROJECT_NAME_CHARACTERS
  );
};

export const isFilesCountValid = (files_count: number): boolean => {
  return files_count <= 0;
};

export const isUpdateFilesCountValid = (files_count: number): boolean => {
  return files_count < 0;
};

export const isBatchObservationValid = (observation: string): boolean => {
  return (
    observation.length < validationConstants.MIN_BATCH_OBSERVATION_CHARACTERS
  );
};

export const isSettlementProjectNameInvalid = (name: string): boolean => {
  return (
    name.length < validationConstants.MIN_SETTLEMENT_PROJECT_NAME_CHARACTERS
  );
};

export const isRoleNameInvalid = (name: string): boolean => {
  return name.length < validationConstants.MIN_ROLE_NAME_CHARACTERS;
};

export const isRoleDescriptionInvalid = (description: string): boolean => {
  return (
    description.length < validationConstants.MIN_ROLE_DESCRIPTION_CHARACTERS
  );
};

export const isRoleInvalid = (role: string) => {
  if (role in UserRole) return false;
  return true;
};

export const isPermissionNameInvalid = (name: string): boolean => {
  return name.length < validationConstants.MIN_PERMISSION_NAME_CHARACTERS;
};

export const isPermissionDescriptionInvalid = (
  description: string,
): boolean => {
  return (
    description.length <
    validationConstants.MIN_PERMISSION_DESCRIPTION_CHARACTERS
  );
};

export const isTagsAssignmentCountInvalid = (tags: string[]): boolean => {
  return tags.length > validationConstants.MAX_TAGS_ASSIGN_TO_BATCH;
};

export const isAssignmentSumTagsCountInvalid = (
  currrentTags: string[],
  tagsToBeAssigned: string[],
): boolean => {
  return (
    currrentTags.length + tagsToBeAssigned.length >
    validationConstants.MAX_TAGS_ASSIGN_TO_BATCH
  );
};

export const isAssignmentUsersCountInvalid = (users: string[]): boolean => {
  return users.length > validationConstants.MAX_USERS_ASSIGN_TO_BATCH;
};

export const isAssignmentSumUsersCountInvalid = (
  currrentUsers: string[],
  usersToBeAssigned: string[],
): boolean => {
  return (
    currrentUsers.length + usersToBeAssigned.length >
    validationConstants.MAX_USERS_ASSIGN_TO_BATCH
  );
};

export const isDuplicatedIds = (ids: string[]) => {
  const seenIds = new Set();

  for (const id of ids) {
    if (seenIds.has(id)) {
      return true;
    }

    seenIds.add(id);
  }

  return false;
};

export const isMainStatusBatchInvalid = (status: number) => {
  if (status in MainStatusBatch) return false;
  return true;
};

export const isSpecificStatusBatchInvalid = (status: number) => {
  if (status in SpecificStatusBatch) return false;
  return true;
};

export const isTagNameInvalid = (tagName: string): boolean => {
  return (
    tagName.length > validationConstants.MAX_TAGNAME_CHARACTERS ||
    tagName.length < validationConstants.MIN_TAGNAME_CHARACTERS
  );
};
