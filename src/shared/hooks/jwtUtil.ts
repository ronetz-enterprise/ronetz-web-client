export interface JwtPayload {
  sub: string;
  email?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  domainId?: string;
  tenantId?: string;
  countryCode?: string;
  exp: number;
  iat?: number;
}

export function getJwtPayload(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    // JWT uses base64url (RFC 7515). `atob` expects base64.
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    
    const decoded = JSON.parse(atob(padded));
    console.log(decoded); // ← Déplacez le console.log ici
    console.log("salut");
    
    return decoded as JwtPayload;
  } catch (error) {
    console.error("Erreur de décodage JWT:", error);
    return null;
  }
}