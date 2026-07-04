export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  rawPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  /** ISO alpha code; must match backend `countryIsoCode`. */
  countryIsoCode: string;
  userMacAddress?: string;
}
