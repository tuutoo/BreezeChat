// components/Footer.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image'

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
  tagline = 'AI translation assistant with multi-scenario style switching',
  menuItems = [
    {
      title: 'Features',
      links: [
        { text: 'Translation', url: '#' },
        { text: 'Scene Modes', url: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'FAQ', url: 'https://github.com/neozhu/lingualens' },
        { text: 'Contact Me', url: 'https://blazorserver.com/contact' },
      ],
    },
    {
      title: 'About',
      links: [
        { text: 'Privacy Policy', url: '/privacy' },
        { text: 'Terms of Service', url: '/terms' },
      ],
    },
  ],
  copyright = '© 2025 LinguaLens. All rights reserved.',
  bottomLinks = [
    { text: 'Privacy Policy', url: '/privacy' },
    { text: 'Terms of Service', url: '/terms' },
  ],
}: FooterProps) => {
  return (
    <footer className="bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          <div className="col-span-2 mb-8 lg:mb-0">
            <Link href={logo.url} className="flex items-center gap-2">
              <Image src={logo.src} alt={logo.alt} className="h-10" width="40" height="40" />
              <span className="text-xl font-semibold">{logo.title}</span>
            </Link>
            <p className="mt-4 text-muted-foreground">{tagline}</p>
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
          <p>{copyright}</p>
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
