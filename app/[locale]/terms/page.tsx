import { getMessages } from 'next-intl/server';
import TermsContent from './terms-content';

export default async function TermsOfService() {
  const messages = await getMessages();

  return <TermsContent messages={messages} />;
}