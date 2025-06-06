"use client";

import { Button } from "@/components/ui/button";
import { Languages, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from '@/i18n/routing';
import { ModeToggle } from "./mode-toggle";
import { ThemeSelector } from "./theme-selector";
import { LanguageSwitch } from "./language-switch";
import { useTheme } from 'next-themes';
import Image from 'next/image'
import { useTranslations } from 'next-intl';

export const Header = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { theme } = useTheme();
    const t = useTranslations();
    const githubUrl = 'https://github.com/tuutoo/breezechat';

    useEffect(() => {
        setIsMounted(true); // Set isMounted to true once the component is mounted on the client-side
    }, []);

    if (!isMounted) return null;

    return (
        <header className="w-full z-40 fixed top-0 left-0 bg-background border-b">
            <div className="container relative mx-auto min-h-16 lg:min-h-20 flex gap-2 lg:gap-4 flex-row items-center px-4 sm:px-8 lg:px-16 py-3 lg:py-4">
                <div className="justify-start items-center gap-2 lg:gap-4 flex flex-row">
                    <Link href="/" className="flex items-center gap-2">
                        <Languages className="w-5 h-5 lg:w-6 lg:h-6" />
                        <span className="sm:grid hidden text-lg lg:text-xl font-semibold motion motion-duration-500 motion-translate-x-in-[50%] motion-translate-y-in-[0%] motion-preset-blur-right" >BreezeChat</span>
                    </Link>
                    <Link href="/admin" className="hidden sm:block">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Settings className="h-4 w-4" />
                            <span className="hidden md:inline">{t('header.systemAdmin')}</span>
                        </Button>
                    </Link>
                </div>
                <div className="flex justify-end w-full gap-1 lg:gap-4">
                    <Link href="/admin" className="sm:hidden">
                        <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                        </Button>
                    </Link>
                    <LanguageSwitch />
                    <ThemeSelector />
                    <ModeToggle />
                    <Button variant="outline" size="icon" asChild className="hidden sm:flex">
                        <Link
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={t('header.github')}
                        >
                            <Image
                                src={
                                    theme === 'dark'
                                        ? '/github-mark-white.svg'
                                        : '/github-mark.svg'
                                }
                                alt={t('header.github')}
                                className="w-4 h-4 lg:w-5 lg:h-5"
                                width="40" height="40"
                            />
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
};