export interface CompanyRegistrationRequest {
  arabicName: string;
  englishName: string;
  email: string;
  phoneNumber?: string;
  websiteUrl?: string;
 
}



export interface SetPasswordRequest {
  email: string;
  otpCode: string; 
  newPassword: string; 
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    expiresInMinutes: number;
    userId: number;
    companyId: number;
    email: string;
    companyName: string;
    companyArabicName: string;
    tokenType: string;
  };
  errors: string[];
}

export interface SendOtpRequest {
  email: string;
}


