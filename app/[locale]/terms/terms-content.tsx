'use client';

import { useTranslations } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';

export default function TermsContent({
  messages
}: {
  messages: Record<string, unknown>;
}) {
  return (
    <NextIntlClientProvider messages={messages}>
      <TermsContentInner />
    </NextIntlClientProvider>
  );
}

function TermsContentInner() {
  const t = useTranslations();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-background shadow rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{t('legal.termsOfService')}</h1>
      <p className="text-sm text-gray-400">{t('legal.lastUpdated')}: May 3, 2025</p>

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h2>
        <p className="text-sm text-muted-foreground">
          {t('terms.acceptance')}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">2. Description of Service</h2>
        <p className="text-sm text-muted-foreground">
          {t('terms.description')}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">3. License and Open Source</h2>
        <p className="text-sm text-muted-foreground">
          {t('terms.license')}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">4. No Warranty</h2>
        <p className="text-sm text-muted-foreground">
          {t('terms.warranty')}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">5. Limitation of Liability</h2>
        <p className="text-sm text-muted-foreground">
          {t('terms.liability')}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">6. Privacy</h2>
        <p className="text-sm text-muted-foreground">
          {t('terms.privacy')}
        </p>
      </section>

      <section className="mt-6 mb-8">
        <h2 className="text-lg font-semibold mb-2">7. Changes to Terms</h2>
        <p className="text-sm text-muted-foreground">
          {t('terms.changes')}
        </p>
      </section>

      <section className="mt-6 mb-8">
        <h2 className="text-lg font-semibold mb-2">8. Contact Us</h2>
        <p className="text-sm text-muted-foreground">
          {t('terms.contact')} <a href="mailto:neo.js.cn@gmail.com" className="text-blue-600 underline">neo.js.cn@gmail.com</a>.
        </p>
      </section>
    </div>
  );
}