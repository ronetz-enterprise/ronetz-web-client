import { FirebaseError } from "firebase/app";

// https://firebase.google.com/docs/reference/js/auth#autherrorcodes
const MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "Email ou mot de passe incorrect",
  "auth/invalid-email": "Adresse email invalide",
  "auth/user-disabled": "Ce compte a été désactivé",
  "auth/user-not-found": "Aucun compte ne correspond à cet email",
  "auth/wrong-password": "Email ou mot de passe incorrect",
  "auth/email-already-in-use": "Un compte existe déjà avec cet email",
  "auth/weak-password": "Le mot de passe doit contenir au moins 6 caractères",
  "auth/too-many-requests": "Trop de tentatives, réessayez plus tard",
  "auth/network-request-failed": "Problème réseau, vérifiez votre connexion",
  "auth/popup-blocked": "La fenêtre Google a été bloquée par votre navigateur",
  "auth/account-exists-with-different-credential":
    "Un compte existe déjà avec cet email via un autre mode de connexion",
  "auth/unauthorized-domain": "Ce domaine n'est pas autorisé pour la connexion Google",
  // "auth/popup-closed-by-user" et "auth/cancelled-popup-request" ne sont pas
  // listés ici : le provider les traite comme une annulation silencieuse
  // (retour `null`), pas comme une erreur à afficher.
};

/** Maps a Firebase Auth error to a user-facing French message, with a fallback for anything else. */
export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof FirebaseError) {
    return MESSAGES[error.code] ?? fallback;
  }
  return fallback;
}
