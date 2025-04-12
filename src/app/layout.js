import ClientProviders from "./ClientProviders";

export const metadata = {
  title: "Moyar Perfume",
  description: "Believe In Miracle",
  icons: "/logo/logo.ico",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
