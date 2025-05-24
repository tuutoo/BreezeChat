"use client";

import { Button } from "@/components/ui/button";
import { Languages, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { ThemeSelector } from "./theme-selector";
import { LanguageSwitch } from "./language-switch";
import { useTheme } from 'next-themes';
import Image from 'next/image'
import { useLocale } from "@/hooks/use-locale";

export const Header = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { theme } = useTheme();
    const { locale, t } = useLocale();
    const githubUrl = 'https://github.com/neozhu/lingualens';

    useEffect(() => {
        setIsMounted(true); // Set isMounted to true once the component is mounted on the client-side
    }, []);

    if (!isMounted) return null;

    return (
        <header className="w-full z-40 fixed top-0 left-0 bg-background">
            <div className="container relative mx-auto min-h-20 flex gap-4 flex-row grid-cols-2 items-center px-4 sm:px-8 lg:px-16 py-4">
                <div className="justify-start items-center gap-4  flex  flex-row">
                    <Link href={`/${locale}`} className="flex items-center gap-2">
                        <Languages className="w-6 h-6" />
                        <span className="sm:grid hidden text-xl font-semibold motion motion-duration-500 motion-translate-x-in-[50%] motion-translate-y-in-[0%] motion-preset-blur-right" >LinguaLens</span>
                    </Link>
                    <Link href={`/${locale}/admin`}>
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Settings className="h-4 w-4" />
                            {t('systemAdmin')}
                        </Button>
                    </Link>
                </div>
                <div className="flex justify-end w-full gap-4">
                    <LanguageSwitch />
                    <ThemeSelector />
                    <ModeToggle />
                    <Button variant="outline" size="icon" asChild>
            <Link
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('github')}
            >

                <Image
                  src={
                    theme === 'dark'
                      ? '/github-mark-white.svg'
                      : '/github-mark.svg'
                  }
                  alt={t('github')}
                  className="w-5 h-5"
                  width="40" height="40"
                />

            </Link>
          </Button>
                </div>
            </div>
        </header>
    );
};