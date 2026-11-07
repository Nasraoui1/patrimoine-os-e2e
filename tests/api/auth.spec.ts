import { expect, test, type APIRequestContext } from '@playwright/test';
import { testUser, uniqueEmail, VALID_PASSWORD } from '../../utils/test-data';

/**
 * L'API limite /auth/signup à 5 requêtes/heure par IP (@Throttle).
 * Si la limite est atteinte (429), on saute le test au lieu de le faire échouer.
 */
async function signup(request: APIRequestContext, data: Record<string, unknown>) {
  const res = await request.post('auth/signup', { data });
  test.skip(res.status() === 429, 'Rate limit /auth/signup atteint (5/h) — relancer plus tard');
  return res;
}

test.describe('Auth (API)', () => {
  test.describe('POST /auth/signup', () => {
    test.describe.configure({ mode: 'serial' });

    test('crée un compte propriétaire', async ({ request }) => {
      const email = uniqueEmail('signup');
      const res = await signup(request, {
        email, password: VALID_PASSWORD, firstName: 'E2E', lastName: 'Test', role: 'owner',
      });
      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.email).toBe(email);
      expect(body).not.toHaveProperty('password');
      expect(body).not.toHaveProperty('passwordHash');
    });

    test('refuse un mot de passe trop faible (400)', async ({ request }) => {
      const res = await signup(request, {
        email: uniqueEmail('weak'), password: 'court', firstName: 'E2E', lastName: 'Test', role: 'owner',
      });
      expect(res.status()).toBe(400);
    });

    test('refuse un rôle non autorisé (400)', async ({ request }) => {
      const res = await signup(request, {
        email: uniqueEmail('role'), password: VALID_PASSWORD, firstName: 'E2E', lastName: 'Test', role: 'admin',
      });
      expect(res.status()).toBe(400);
    });
  });

  test.describe('POST /auth/login', () => {
    test('refuse des identifiants inconnus (401)', async ({ request }) => {
      const res = await request.post('auth/login', {
        data: { email: uniqueEmail('nobody'), password: 'MauvaisMotDePasse!1' },
      });
      expect(res.status()).toBe(401);
    });

    test('refuse un body invalide (400)', async ({ request }) => {
      const res = await request.post('auth/login', { data: { email: 'pas-un-email' } });
      expect(res.status()).toBe(400);
    });

    test('connecte un utilisateur valide et donne accès à /auth/me', async ({ request }) => {
      test.skip(!testUser.isConfigured, 'E2E_USER_EMAIL / E2E_USER_PASSWORD non définis');

      const login = await request.post('auth/login', {
        data: { email: testUser.email, password: testUser.password },
      });
      expect(login.status()).toBe(200);
      const { accessToken } = await login.json();
      expect(accessToken).toBeTruthy();

      const me = await request.get('auth/me', { headers: { Authorization: `Bearer ${accessToken}` } });
      expect(me.status()).toBe(200);
      expect((await me.json()).email).toBe(testUser.email.toLowerCase());
    });
  });

  test('GET /auth/me sans token renvoie 401', async ({ request }) => {
    const res = await request.get('auth/me');
    expect(res.status()).toBe(401);
  });
});
