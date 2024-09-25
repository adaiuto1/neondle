import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Neondle",
	description: "Neon White Game by Universal",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
