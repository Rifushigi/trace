export interface TResponseDTO {
  status: boolean;
  message: string;
  data?: any;
}

export interface TUserProfileResponseDTO {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatar?: string;
  role: "admin" | "lecturer" | "student";
  isVerified: boolean;
}