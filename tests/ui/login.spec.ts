import { expect, test } from '../fixtures';
import { LoginPage } from '../pages/LoginPage';
import { testUser, uniqueEmail } from '../../utils/test-data';

test.describe('Connexion (UI)', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('affiche le formulaire de connexion', async () => {
    await expect(loginPage.title).toHaveText('Connexion');
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeEnabled();
  });

  test('valide les champs obligatoires côté client', async ({ page }) => {
    await loginPage.submitButton.click();
    await expect(page.getByText("L'adresse e-mail est requise.")).toBeVisible();
    await expect(page.getByText('Le mot de passe est requis.')).toBeVisible();
  });

  test("refuse un e-mail au format invalide", async ({ page }) => {
    await loginPage.login('pas-un-email', 'peu-importe');
    await expect(page.getByText("L'adresse e-mail n'est pas valide.")).toBeVisible();
  });

  test('affiche une erreur avec des identifiants inconnus', async () => {
    // Email unique : n'incrémente pas le compteur de verrouillage d'un vrai compte.
    await loginPage.login(uniqueEmail('unknown'), 'MauvaisMotDePasse!1');
    await expect(loginPage.errorAlert).toBeVisible();
  });

  test('bascule en mode lien magique', async ({ page }) => {
    await loginPage.magicLinkTab.click();
    await expect(loginPage.magicLinkTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('button', { name: /Envoyer mon lien magique/ })).toBeVisible();
    await expect(loginPage.passwordInput).toBeHidden();
  });

  test("navigue vers l'inscription", async ({ page }) => {
    await loginPage.registerLink.click();
    await expect(loginPage.title).not.toHaveText('Connexion');
    await expect(page).toHaveURL(/\/register/);
  });

  test('connecte un utilisateur valide', async ({ page }) => {
    test.skip(!testUser.isConfigured, 'E2E_USER_EMAIL / E2E_USER_PASSWORD non définis');
    await loginPage.login(testUser.email, testUser.password);
    await expect(page).not.toHaveURL(/\/login/);
  });
});
