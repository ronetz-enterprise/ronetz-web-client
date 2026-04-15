export interface JwtPayload {
  sub: string;
  email?: string;
  role?: string;
  exp: number;
  iat?: number;
}

export function getJwtPayload(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}