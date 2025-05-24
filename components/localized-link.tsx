"use client";

import NextLink from 'next/link';
import { HTMLAttributes } from 'react';
import { useLocale } from '@/hooks/use-locale';

interface LocalizedLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
  locale?: string;
  children: React.ReactNode;
  className?: string;
}

export default function LocalizedLink({
  href,
  locale: localeProp,
  children,
  ...props
}: LocalizedLinkProps) {
  const { locale: currentLocale, getLocalizedPath } = useLocale();
  const locale = localeProp || currentLocale;

  // If the href already has a locale prefix, use it directly
  if (href.match(/^\/[a-z]{2}(\/|$)/)) {
    return <NextLink href={href} {...props}>{children}</NextLink>;
  }

  // If the href is an external link (starts with http or https), use it directly
  if (href.match(/^https?:\/\//)) {
    return <NextLink href={href} {...props}>{children}</NextLink>;
  }

  // Otherwise, prepend the current locale
  const localizedHref = href.startsWith('/')
    ? `/${locale}${href}`
    : `/${locale}/${href}`;

  return <NextLink href={localizedHref} {...props}>{children}</NextLink>;
}
