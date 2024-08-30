import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
import { UserProvider } from "@/context/UserContext";

export const metadata = {
  title: "Sunrise Aluminium",
  description: "",
  icons: {
    icon: "/images/bg_sun.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <UserProvider>
          {children}
        </UserProvider>
        <script src="https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.js"></script>
      </body>
    </html>
  );
}
