import type { Locator, Page } from '@playwright/test';

/** Page Object de l'écran /login de patrimoine-os-web. */
export class LoginPage {
  readonly title: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly magicLinkTab: Locator;
  readonly errorAlert: Locator;
  readonly registerLink: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(private readonly page: Page) {
    // Le header de l'app a aussi un <h1> : on cible celui du contenu principal.
    this.title = page.getByRole('main').getByRole('heading', { level: 1 });
    this.emailInput = page.getByLabel('Adresse e-mail');
    this.passwordInput = page.getByLabel('Mot de passe', { exact: true });
    this.submitButton = page.getByRole('button', { name: 'Se connecter' });
    this.magicLinkTab = page.getByRole('tab', { name: /Lien magique/ });
    this.errorAlert = page.getByRole('alert');
    this.registerLink = page.getByRole('button', { name: 'Créer un compte' });
    this.forgotPasswordLink = page.getByRole('button', { name: 'Mot de passe oublié ?' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
