export interface AuthData {
  id?: string;
  accessToken?: string;
  refreshToken?: string;
  role?: string;
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

export type FilterCheckOptions = {
  searchText: boolean;
  minRating: boolean;
  maxRating: boolean;
  exactRating: boolean;
};
