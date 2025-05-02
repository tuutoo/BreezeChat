"use client";

import { Button } from "@/components/ui/button";
import {  Languages } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { ThemeSelector } from "./theme-selector";
import { useTheme } from 'next-themes';

export const Header = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { theme } = useTheme();
    const githubUrl = 'https://github.com/neozhu/lingualens';
    useEffect(() => {
        setIsMounted(true); // Set isMounted to true once the component is mounted on the client-side
    }, []);

    if (!isMounted) return null;
    return (
        <header className="w-full z-40 fixed top-0 left-0 bg-background">
            <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-2 items-center">
                <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
                    <Link href="/" className="flex items-center gap-2">
                        <Languages className="w-6 h-6" />
                        <span className="text-xl font-semibold">LinguaLens</span>
                    </Link>
                </div>
                <div className="flex justify-end w-full gap-4">
                    <ThemeSelector />
                    <ModeToggle />
                    <Button variant="outline" size="icon" asChild>
            <Link
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub 仓库"
            >
              
                <img
                  src={
                    theme === 'dark'
                      ? '/github-mark-white.svg'
                      : '/github-mark.svg'
                  }
                  alt="GitHub 仓库"
                  className="w-5 h-5"
                />
             
            </Link>
          </Button>
                </div>
            </div>
        </header>
    );
};