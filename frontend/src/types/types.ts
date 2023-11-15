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
