// components/Footer.tsx
'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface MenuItem {
  title: string;
  links: { text: string; url: string }[];
}

interface FooterProps {
  logo?: { url: string; src: string; alt: string; title: string };
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: { text: string; url: string }[];
}

export const Footer: React.FC<FooterProps> = ({
  logo = {
    src: '/github-mark.svg',
    alt: 'LinguaLens Logo',
    title: 'LinguaLens',
    url: '/',
  },
}: FooterProps) => {
  const t = useTranslations();

  const menuItems = [
    {
      title: t('footer.features'),
      links: [
        { text: t('footer.translation'), url: 'https://github.com/neozhu/lingualens' },
        { text: t('footer.sceneModes'), url: '/scene' },
      ],
    },
    {
      title: t('footer.support'),
      links: [
        { text: t('footer.faq'), url: 'https://github.com/neozhu/lingualens' },
        { text: t('footer.contactMe'), url: 'https://blazorserver.com/contact' },
      ],
    },
    {
      title: t('footer.about'),
      links: [
        { text: t('legal.privacyPolicy'), url: '/privacy' },
        { text: t('legal.termsOfService'), url: '/terms' },
      ],
    },
  ];

  const bottomLinks = [
    { text: t('legal.privacyPolicy'), url: '/privacy' },
    { text: t('legal.termsOfService'), url: '/terms' },
  ];

  return (
    <footer className="w-full bg-background py-12 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          <div className="col-span-2 mb-8 lg:mb-0">
            <Link href={logo.url} className="flex items-center gap-2">
              <Image src={logo.src} alt={logo.alt} className="h-10" width="40" height="40" />
              <span className="text-xl font-semibold">{logo.title}</span>
            </Link>
            <p className="mt-4 text-muted-foreground">{t('footer.tagline')}</p>
          </div>

          {menuItems.map((section, idx) => (
            <div key={idx}>
              <h3 className="mb-4 font-bold">{section.title}</h3>
              <ul className="space-y-2 text-muted-foreground">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx} className="hover:text-primary">
                    <Link href={link.url}>{link.text}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t pt-6 text-sm text-muted-foreground flex flex-col md:flex-row md:justify-between items-center gap-4">
          <p>{t('footer.copyright')}</p>
          <ul className="flex gap-4">
            {bottomLinks.map((link, idx) => (
              <li key={idx} className="underline hover:text-primary">
                <Link href={link.url}>{link.text}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};
