import { getTranslations } from 'next-intl/server';
import PrivacyPolicyContent from './privacy-content';

export default async function PrivacyPolicy({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const messages = await getTranslations(locale);

  return <PrivacyPolicyContent messages={messages} />;
}