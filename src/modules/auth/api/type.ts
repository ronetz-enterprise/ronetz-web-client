export interface LoginRequest {
  email: string;
  rawPassword: string;
}

export interface SignInRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
}

export interface RegisterRequest {
  email: string;
  rawPassword: string;
}
