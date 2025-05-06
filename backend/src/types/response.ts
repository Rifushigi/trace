export interface IResponseDTO {
  status: boolean;
  message: string;
  data?: any;
}

export interface IUserProfileResponseDTO {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatar?: string;
  role: "admin" | "lecturer" | "student";
  isVerified: boolean;
}