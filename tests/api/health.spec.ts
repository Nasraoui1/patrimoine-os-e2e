import { expect, test } from '@playwright/test';

test.describe('Health (API)', () => {
  test('GET /health répond 200 avec la base de données up', async ({ request }) => {
    const res = await request.get('health');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.info?.database?.status).toBe('up');
  });

  test('GET /health/detailed expose les infos runtime', async ({ request }) => {
    const res = await request.get('health/detailed');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toMatchObject({ status: 'ok' });
    expect(typeof body.uptimeSeconds).toBe('number');
  });
});
