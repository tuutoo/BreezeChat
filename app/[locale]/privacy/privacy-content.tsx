'use client';

import { useTranslations } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';

export default function PrivacyPolicyContent({
  messages
}: {
  messages: Record<string, unknown>;
}) {
  return (
    <NextIntlClientProvider messages={messages}>
      <PrivacyPolicyContentInner />
    </NextIntlClientProvider>
  );
}

function PrivacyPolicyContentInner() {
  const t = useTranslations();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-background shadow rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{t('legal.privacyPolicy')}</h1>
      <p className="text-sm text-gray-500">{t('legal.lastUpdated')}: May 3, 2025</p>

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Introduction</h2>
        <p className="text-sm text-muted-foreground">
          {t('privacy.intro')}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Information Collection</h2>
        <p className="text-sm text-muted-foreground">
          {t('privacy.collection')}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Cookies and Tracking</h2>
        <p className="text-sm text-muted-foreground">
          {t('privacy.cookies')}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Third-Party Services</h2>
        <p className="text-sm text-muted-foreground">
          {t('privacy.thirdParty')}
        </p>
      </section>

      <section className="mt-6 mb-8">
        <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
        <p className="text-sm text-muted-foreground">
          {t('privacy.contact')} <a href="mailto:neo.js.cn@gmail.com" className="text-blue-600 underline">neo.js.cn@gmail.com</a>.
        </p>
      </section>
    </div>
  );
}