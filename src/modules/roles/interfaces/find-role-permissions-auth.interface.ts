export interface FindRolePermissionsAuthResponse {
  name: string;
  permissions: Permission[];
}

interface Permission {
  permission_id: string;
  permission_name: string;
}
