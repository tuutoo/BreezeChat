import { getMessages } from 'next-intl/server';
import PrivacyPolicyContent from './privacy-content';

export default async function PrivacyPolicy() {
  const messages = await getMessages();

  return <PrivacyPolicyContent messages={messages} />;
}