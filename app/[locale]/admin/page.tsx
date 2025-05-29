"use client";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Database, Bot, LogOut, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function LocalizedAdminPage() {
	const router = useRouter();
	const t = useTranslations();

	const handleLogout = async () => {
		try {
			const response = await fetch("/api/auth/logout", {
				method: "POST",
			});

			if (response.ok) {
				router.push("/login");
			} else {
				toast({
					title: t("common.error"),
					description: t("admin.logoutError"),
					variant: "destructive",
				});
			}
		} catch {
			toast({
				title: t("common.error"),
				description: t("admin.logoutError"),
				variant: "destructive",
			});
		}
	};

	return (
		<div className="container mx-auto py-10">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">{t("admin.title")}</h1>
				<Button variant="outline" onClick={handleLogout}>
					<LogOut className="h-4 w-4 mr-2" />
					{t("admin.logout")}
				</Button>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Link href="/admin/models">
					<Card className="hover:bg-accent/50 transition-colors cursor-pointer">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Bot className="h-5 w-5" />
								{t("admin.modelManagement")}
							</CardTitle>
							<CardDescription>
								{t("admin.modelDescription")}
							</CardDescription>
						</CardHeader>
					</Card>
				</Link>

				<Link href="/admin/subject">
					<Card className="hover:bg-accent/50 transition-colors cursor-pointer">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<BookOpen className="h-5 w-5" />
								{t("admin.subjectManagement")}
							</CardTitle>
							<CardDescription>
								{t("admin.subjectDescription")}
							</CardDescription>
						</CardHeader>
					</Card>
				</Link>

				<Link href="/admin/scene">
					<Card className="hover:bg-accent/50 transition-colors cursor-pointer">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Database className="h-5 w-5" />
								{t("admin.sceneManagement")}
							</CardTitle>
							<CardDescription>
								{t("admin.sceneDescription")}
							</CardDescription>
						</CardHeader>
					</Card>
				</Link>
			</div>
			<Toaster />
		</div>
	);
}
