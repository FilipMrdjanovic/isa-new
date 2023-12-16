export interface Data {
  message: string;
  status: number;
  token?: string;
  newToken?: string;
  user?: {};
  userRank?: string;
  companies?: {};
}

export interface AuthData {
  token: string;
  id: number;
  role: string;
}

export interface RefreshToken {
  newToken: string;
  status: number;
  message: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UserData {
  email: string;
  firstname: string;
  lastname: string;
  city: string;
  country: string;
  phone: string;
  jmbg: string;
  gender: string;
  occupation: string;
  organization: string;
  penaltyPoints: string;
  loyaltyPoints: string;
}

export interface UpdatePassword {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface FilterTableCompanies {
  id: number;
  name: string;
  address: string;
  city: string;
  averageRating: number;
}

export interface FilterTableCompaniesParams {
  searchText: string;
  minRating: number;
  maxRating: number;
  exactRating: number;
}

export interface FilterTableEquipmentSetsParams {
  searchText: string;
  exactQuantity: number;
}

export type FilterCheckOptions = {
  searchText?: boolean;
  minMaxRating?: boolean;
  exactRating?: boolean;
  exactQuantity?: boolean;
};

export interface AuthRoutesProps {
  role: string | undefined;
}

export type EquipmentResponse = {
  message: string;
  status: number;
  equipment: Equipment;
};

export type Equipment = {
  id: number;
  name: string;
  description: string;
};

export type EquipmentsResponse = {
  message: string;
  status: number;
  equipments: Equipment[];
};

export type EquipmentSetsResponse = {
  message: string;
  status: number;
  equipmentSets: EquipmentSet[];
};

export type EquipmentSetResponse = {
  message: string;
  status: number;
  equipmentSet: EquipmentSet;
};

export type EquipmentSet = {
  id: number;
  quantity: number;
  equipment: Equipment;
};

export type TimeSlot = {
  start: string;
  end: string;
};

export type PickupSchedule = {
  id: number;
  date: string;
  time: string;
  duration: number;
  reserved: boolean;
  active: boolean;
  completed: boolean;
  pickupScheduleType: "PREDEFINED" | "USERDEFINED"; // Adjust this type according to your actual types
};

export type CreatePickupSchedule = {
    id: number;
    date: string;
    time: string;
    equipmentSetId: number;
}

export type AvailablePickupSchedulesResponse = {
  message: string;
  status: number;
  pickupSchedules: PickupSchedule[];
  freeTimeSlots?: TimeSlot[];
};
