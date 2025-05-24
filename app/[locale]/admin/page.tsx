"use client";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Database, Bot, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useLocale } from "@/hooks/use-locale";

export default function LocalizedAdminPage() {
	const router = useRouter();
	const { locale, t } = useLocale();

	const handleLogout = async () => {
		try {
			const response = await fetch("/api/auth/logout", {
				method: "POST",
			});

			if (response.ok) {
				router.push(`/${locale}/login`);
			} else {
				toast({
					title: t("error"),
					description: t("logoutError"),
					variant: "destructive",
				});
			}
		} catch {
			toast({
				title: t("error"),
				description: t("logoutError"),
				variant: "destructive",
			});
		}
	};

	return (
		<div className="container mx-auto py-10">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">{t("admin")}</h1>
				<Button variant="outline" onClick={handleLogout}>
					<LogOut className="h-4 w-4 mr-2" />
					{t("logout")}
				</Button>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Link href={`/${locale}/admin/models`}>
					<Card className="hover:bg-accent/50 transition-colors cursor-pointer">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Bot className="h-5 w-5" />
								{t("modelManagement")}
							</CardTitle>
							<CardDescription>
								{t("modelDescription")}
							</CardDescription>
						</CardHeader>
					</Card>
				</Link>

				<Link href={`/${locale}/admin/scene`}>
					<Card className="hover:bg-accent/50 transition-colors cursor-pointer">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Database className="h-5 w-5" />
								{t("sceneManagement")}
							</CardTitle>
							<CardDescription>
								{t("sceneDescription")}
							</CardDescription>
						</CardHeader>
					</Card>
				</Link>
			</div>
			<Toaster />
		</div>
	);
}
