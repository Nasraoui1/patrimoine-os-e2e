import { test as base, expect } from '@playwright/test';

/**
 * Fixture commune aux tests UI : ferme la bannière cookies (CNIL/RGPD) dès qu'elle
 * apparaît, pour qu'elle ne masque pas les éléments cliqués par les tests.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addLocatorHandler(
      page.getByRole('region', { name: 'Gestion des cookies' }),
      async (banner) => {
        await banner.getByRole('button', { name: 'Tout refuser' }).click();
      },
    );
    await use(page);
  },
});

export { expect };
