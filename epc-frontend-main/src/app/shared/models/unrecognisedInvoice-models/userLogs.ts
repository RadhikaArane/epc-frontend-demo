export interface DropdownItem {
  value: string;
  text: string;
}

export type DropdownList = DropdownItem[];

export interface UserAddPayload {
  password?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  designation: string;
  roleId: string;
  activeStatus: boolean;
  reportingManagerId?: string;
  employeeId: string;
  lockStatus: boolean;
  createdBy: string;
  projectTypeId: number;
  zone: string;
  zoneName: string;
  region: string;
  regionName: string;
  area: string;
  areaName: string;
}

export interface UserAddResponse {
  Success: boolean;
  Message: string;
}
