import { getTranslations } from 'next-intl/server';
import TermsContent from './terms-content';

export default async function TermsOfService({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const messages = await getTranslations(locale);

  return <TermsContent messages={messages} />;
}