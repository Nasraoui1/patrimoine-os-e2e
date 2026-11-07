import { randomUUID } from 'node:crypto';

/** Email unique par exécution pour éviter les conflits (409) et les verrouillages de compte. */
export function uniqueEmail(prefix = 'e2e'): string {
  return `${prefix}+${Date.now()}-${randomUUID().slice(0, 8)}@example.test`;
}

/** Mot de passe conforme aux règles de SignupDto (12+ caractères, lettre, chiffre, symbole). */
export const VALID_PASSWORD = 'Motdepasse!2026';

export const testUser = {
  email: process.env.E2E_USER_EMAIL ?? '',
  password: process.env.E2E_USER_PASSWORD ?? '',
  isConfigured: Boolean(process.env.E2E_USER_EMAIL && process.env.E2E_USER_PASSWORD),
};
