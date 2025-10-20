export const metadata = {
  title: "LinkedIn Dashboard",
  description: "Terence's LinkedIn performance dashboard",
};

import "./../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
